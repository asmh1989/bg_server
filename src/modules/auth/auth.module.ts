import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthProvider } from './auth.model';
import { HttpStrategy } from './http.strategy';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '@app/processors/database/database.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'bearer' }),
    DatabaseModule,
  ],
  providers: [AuthService, ...AuthProvider, HttpStrategy],
  controllers: [AuthController],
  exports: [AuthService, PassportModule],
})
export class AuthModule { }
