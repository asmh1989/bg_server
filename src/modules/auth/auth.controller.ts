import { Controller, Body, Post, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLocal } from './auth.model';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ){}


    @Post('register')    
    async register(@Body() auth: AuthLocal): Promise<any>{
        return this.authService.register(auth);
    }

    @Get('user')
    @UseGuards(AuthGuard())
    async getUser(): Promise<any> {
        return 'ok';
    }

}
