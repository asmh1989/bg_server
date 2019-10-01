/**
 * Model transform.
 * @file 模型转换器
 * @description 用于将一个基本的 Typegoose 模型转换为 Model 和 Provider，及模型注入器
 * @module transform/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { Connection, Model } from 'mongoose';
import { Provider, Inject } from '@nestjs/common';
import { DB_CONNECTION_TOKEN, DB_MODEL_TOKEN_SUFFIX } from '@app/constants/system.constant';
import { getModelForClass } from '@typegoose/typegoose';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';


export function getModelToken(modelName: string): string {
  return modelName + DB_MODEL_TOKEN_SUFFIX;
}

// 根据 Model 获取 Provider
export function getProviderByClass<T, U extends AnyParamConstructor<T>>(cls: U): Provider {
  return {
    provide: getModelToken(cls.name),
    useFactory: (connection: Connection) => getModelForClass(cls),
    inject: [DB_CONNECTION_TOKEN],
  };
}

// 注入器
export function InjectModel<T, U extends AnyParamConstructor<T>>(model: U) {
  return Inject(getModelToken(model.name));
}
