import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super(
      {
      usernameField: 'id',
      }
    );
  }

  async validate(id: string, pwd: string) {
    console.log('localstrategy.validate');
    const user = await this.authService.validateUser(id, pwd);
    return user;
  }
}
