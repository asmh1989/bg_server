import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class HttpStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(token: string) {
    const user = await this.authService.validateUser(token);
    if (!user) {
      throw new UnauthorizedException();
    } else {
      if (
        user.updatedAt.getTime() + user.expiresIn * 1000 >
        new Date().getTime()
      ) {
        return user;
      } else {
        throw new UnauthorizedException();
      }
    }
  }
}
