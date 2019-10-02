/**
 * App config.
 * @file 应用运行配置
 */

import { argv } from 'yargs';

export const APP = {
  LIMIT: 16,
  PORT: 3000,
  ROOT_PATH: __dirname,
  NAME: 'BpServer',
};

export const MONGODB = {
  uri: `mongodb://127.0.0.1:${argv.dbport || '27017'}/bg`,
  username: argv.db_username || 'DB_username',
  password: argv.db_password || 'DB_password',
};

export const QINIU = {
  accessKey: argv.qn_accessKey || 'qiniu access key',
  secretKey: argv.qn_secretKey || 'qiniu secret key',
  bucket: argv.qn_bucket || 'qiniu bucket name',
  origin: argv.qn_origin || 'qiniu origin url',
  uploadURL: argv.qn_uploadURL || 'http://up.qiniu.com/',
};

export const AUTH = {
  expiresIn: argv.auth_expires_in || 3600 * 2,
  data: argv.auth_data || { user: 'root' },
  jwtTokenSecret: argv.auth_key || 'nodepress',
  defaultPassword: argv.auth_default_password || 'root',
};

export const WECHAT = {
  Appid: 'wx6f37427ae384cfd4',
  AppSecret: '8d60969949458060b22a387e6b60ec0f',
};
