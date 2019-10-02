import { Injectable, BadRequestException, Inject, Req } from '@nestjs/common';
import { AuthLocal, Auth } from './auth.model';
import { InjectModel } from '@app/transforms/model.transform';
import { ModelType } from '@typegoose/typegoose/lib/types';

import { Base64 } from 'js-base64';
import { createHash } from 'crypto';

import * as shortid from 'shortid';

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

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(AuthLocal)
        private readonly authLocalModel: ModelType<AuthLocal>,
        @InjectModel(Auth) private readonly authModel: ModelType<Auth>,
    ) {}

    async validateUser(token: string): Promise<any> {
        return await this.authModel.findOne({ token }).exec();
    }

    async register(auth: AuthLocal): Promise<any> {
        let local = await this.authLocalModel
            .findOne({ userName: auth.userName })
            .exec();
        if (local != null) {
            throw new BadRequestException('用户名已注册');
        } else {
            console.log(auth);
            auth.password = decodeMd5(decodeBase64(auth.password));
            let model = new this.authLocalModel(auth);
            let now = await model.save();

            // console.log('save db : '+ now);

            let token = shortid.generate();
            let userId = now._id.toString();
            let authToken = new Auth();

            authToken.token = token;
            authToken.userId = userId;

            await new this.authModel(authToken).save();

            return token;
        }
    }
}
