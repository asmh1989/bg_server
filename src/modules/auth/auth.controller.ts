import {
    Controller,
    Body,
    Post,
    Get,
    UseGuards,
    Req,
    Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLocal, AuthThird } from './auth.model';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() auth: AuthLocal): Promise<any> {
        return this.authService.register(auth);
    }

    @Get('register/wechat/:code')
    async registerByWechat(@Param('code') code: string): Promise<any> {
        return this.authService.registerByWechat(code);
    }

    @Get('user')
    @UseGuards(AuthGuard())
    async getUser(@Req() request: Request): Promise<any> {
        return request.user;
    }
}
