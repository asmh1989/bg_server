import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// 公共模块
import { DatabaseModule } from '@app/processors/database/database.module';
// import { CacheModule } from '@app/processors/cache/cache.module';
import { HelperModule } from '@app/processors/helper/helper.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [HelperModule, DatabaseModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
