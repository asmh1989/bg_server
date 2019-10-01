/**
 * Auth model.
 * @file 权限和用户数据模型
 */

import { prop } from '@typegoose/typegoose';
import { IsString, IsDefined, IsNotEmpty, IsEmail, IsNumber, Min, Length, MinLength } from 'class-validator';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { getProviderByClass } from '@app/transforms/model.transform';
import * as APP_CONFIG from '@app/app.config';

export enum UserType {
    Local = '本地',
    Wechat = '微信'
}

export enum AccountType {
    general = '普通账号',
    admin = '管理员'
}


// 本地账号
export class AuthLocal extends TimeStamps {

    @IsString({ message: '用户名'})
    @MinLength(6, {message: '用户名长度必须大于6个字符'})
    @prop()
    userName: string;

    @IsString({ message: '手机号码' })
    @prop()
    phone?: string;

    @IsEmail()
    @prop()
    email?: string;

    @IsString()
    @prop()
    password: string;

    passwordNew: string;

    @prop({ default: AccountType.general, enum: AccountType })
    accountType?: AccountType;

    @prop({ default: UserType.Local })
    type: UserType;
}


// 第三方登录账号
export class AuthThird extends TimeStamps {

    @prop({ unique: true })
    userId: string

    @IsString({ message: '第三方id' })
    @prop({ required: true })
    openId: string;

    @IsString({ message: '账号类型' })
    @prop({ default: AccountType.general, enum: AccountType })
    accountType: AccountType;

    @IsString({ message: '第三方登录类型' })
    @prop({ enum: UserType })
    type: UserType;

}

// 登录 token
export class Auth extends TimeStamps {

    @prop({ required: true })
    userId: string

    @IsString({ message: 'token' })
    @prop()
    token: String;

    @IsNumber()
    @prop({default: APP_CONFIG.AUTH.expiresIn})
    expireDate: Number
}


export const AuthProvider = [
    getProviderByClass(AuthLocal),
    getProviderByClass(Auth),
    getProviderByClass(AuthThird)
];