/**
 * Database providers.
 * @file Database 模块构造器
 * @module processor/database/providers
 * @author Surmon <https://github.com/surmon-china>
 */

import * as APP_CONFIG from '@app/app.config';
import { mongoose } from '@app/transforms/mongoose.transform';
import { DB_CONNECTION_TOKEN } from '@app/constants/system.constant';

export const databaseProvider = {
  inject: [],
  provide: DB_CONNECTION_TOKEN,
  useFactory: async () => {
    const RECONNET_INTERVAL = 6000;

    // 连接数据库
    function connection() {
      return mongoose.connect(
        APP_CONFIG.MONGODB.uri,
        {
          useCreateIndex: true,
          useNewUrlParser: true,
          useFindAndModify: false,
          autoReconnect: true,
          useUnifiedTopology: true,
          reconnectInterval: RECONNET_INTERVAL,
        },
        error => {
          if (error) {
            console.error('monogdb error ==> ' + error);
          }
        },
      );
    }

    mongoose.connection.on('connecting', () => {
      console.log('数据库连接中...');
    });

    mongoose.connection.on('open', () => {
      console.info('数据库连接成功！');
    });

    mongoose.connection.on('disconnected', () => {
      console.error(`数据库失去连接！尝试 ${RECONNET_INTERVAL / 1000}s 后重连`);
      setTimeout(connection, RECONNET_INTERVAL);
    });

    mongoose.connection.on('error', error => {
      console.error('数据库发生异常！', error);
      mongoose.disconnect();
    });

    return await connection();
  },
};
