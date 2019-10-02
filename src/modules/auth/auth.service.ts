import { Injectable, BadRequestException, Inject, Req, HttpException } from '@nestjs/common';
import { AuthLocal, Auth, AuthThird, UserType } from './auth.model';
import { InjectModel } from '@app/transforms/model.transform';
import { ModelType } from '@typegoose/typegoose/lib/types';

import { Base64 } from 'js-base64';
import { createHash } from 'crypto';

import * as shortid from 'shortid';
import Axios, { AxiosResponse } from 'axios';
import * as APP_CONFIG from '@app/app.config';

// Base64 编码
export function decodeBase64(value: string): string {
    return value ? Base64.decode(value) : value;
}

// md5 编码
export function decodeMd5(value: string): string {
    return createHash('md5')
        .update(value)
        .digest('hex');
}


const default_password = decodeMd5(decodeBase64('123456'));


interface WechatRes {
    openid: string,
    session_key: string,
    unionid: string,
    errcode: number,
    errmsg: string,
    expires_in: number,
}

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(AuthLocal)
        private readonly authLocalModel: ModelType<AuthLocal>,
        @InjectModel(Auth) private readonly authModel: ModelType<Auth>,
        @InjectModel(AuthThird) private readonly authThirdModel: ModelType<AuthThird>,
    ) { }

    async validateUser(token: string): Promise<any> {
        return await this.authModel.findOne({ token }).exec();
    }

    async newToken(id: string, expiresIn?: number): Promise<string> {
        let token = shortid.generate();

        let time: any = APP_CONFIG.AUTH.expiresIn;
        if (expiresIn) {
            time = expiresIn;
        }

        let auth = await this.authModel.findOne({ userId: id }).exec();
        if (auth) {
            auth.token = token;
            auth.expiresIn = time;
            await auth.save();
        } else {
            let authToken = new Auth();

            authToken.token = token;
            authToken.userId = id;
            authToken.expiresIn = time;

            await new this.authModel(authToken).save();
        }


        return token;
    }

    async register(auth: AuthLocal): Promise<any> {
        let local = await this.authLocalModel
            .findOne({ userName: auth.userName })
            .exec();
        if (local != null) {
            throw new HttpException('用户名已注册', 400);
        } else {
            console.log(auth);
            auth.password = decodeMd5(decodeBase64(auth.password));
            let model = new this.authLocalModel(auth);
            let now = await model.save();

            return await this.newToken(now._id);
        }
    }

    async registerByWechat(code: string): Promise<any> {
        try {
            const res = await Axios.get<any, AxiosResponse<WechatRes>>(`https://api.weixin.qq.com/sns/jscode2session`,
                {
                    params: {
                        appid: APP_CONFIG.WECHAT.Appid,
                        secret: APP_CONFIG.WECHAT.AppSecret,
                        js_code: code,
                        grant_type: 'authorization_code'
                    }
                });
            console.log(' res.data = ' + JSON.stringify(res.data) + ' code = ' + code);
            if (!res.data.errcode || res.data.errcode === 0) {
                let auth = await this.authThirdModel.findOne({ openid: res.data.openid }).exec();
                if (auth) {
                    auth.session_key = res.data.session_key;
                    await auth.save()
                } else {
                    let third = new AuthThird();
                    third.openId = res.data.openid;
                    third.session_key = res.data.session_key;

                    //自动生成一个本地账号对应微信登录的账号
                    let authLocal = new AuthLocal();
                    authLocal.userName = `Wechat_` + shortid.generate();
                    authLocal.password = default_password;
                    authLocal.type = UserType.Wechat;
                    let model1 = await new this.authLocalModel(authLocal).save();
                    // userId 对应本地账号id
                    third.userId = model1._id;

                    auth = await new this.authThirdModel(third).save();
                }

                return await this.newToken(auth.userId, res.data.expires_in);
            } else {
                throw new Error(res.data.errmsg);
            }

        } catch (err) {
            throw new HttpException(err, 400);
        }
    }
}
