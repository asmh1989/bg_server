/**
 * Helper module.
 * @file Helper 全局模块
 * @module processor/helper/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module, Global, HttpModule } from '@nestjs/common';
import { QiniuService } from './helper.service.qiniu';

const services = [QiniuService];

@Global()
@Module({
    imports: [HttpModule],
    providers: services,
    exports: services,
})
export class HelperModule {}
