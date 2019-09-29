/**
 * Auth model.
 * @file 权限和用户数据模型
 */

import { prop, Typegoose } from 'typegoose';
import { IsString, IsDefined, IsNotEmpty, IsEmail, IsNumber, Min } from 'class-validator';
import { getModelBySchema, getProviderByModel } from '@app/transforms/model.transform';

export enum UserType {
    Local = '本地',
    Wechat = '微信'
}

export enum AccountType {
    general = '普通账号',
    admin = '管理员'
}

export class AuthBase extends Typegoose {
    @IsString({ message: '用户id' })
    readonly userId: string;

    @IsDefined()
    readonly createDate: Date;

    @IsString({ message: '账号类型' })
    accountType: AccountType;
    
    @IsString({ message: '第三方登录类型' })
    type: UserType;

    public constructor(id: string){
        super();
        this.userId = id;
        this.createDate = new Date();
        this.accountType = AccountType.general
    }
}

// 本地账号
export class AuthLocal extends AuthBase {

    @IsString({ message: '用户名' })
    userName: string;

    @IsString({ message: '手机号码' })
    @prop({ default: '' })
    phone?: string;

    @IsEmail()
    email?: string;

    @IsString()
    @prop()
    password: string;
}


// 第三方登录账号
export class AuthThird extends AuthBase {

    @IsString({ message: '第三方id' })
    openId: string;
}

// 登录 token
export class Auth extends AuthBase {

    @IsString({ message: 'token' })
    token: String;

    @IsNumber()
    @Min(3600 * 6)
    expireDate: Number
}


export const AuthModel = getModelBySchema(Auth);
export const AuthProvider = getProviderByModel(AuthModel);
