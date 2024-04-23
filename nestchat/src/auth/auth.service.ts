import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { isHashValid } from 'src/util/crypt.util';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

    async validateUser(id: string, password: string): Promise<any> {

      const user = await this.userService.user(id);
      const passwordMatch = isHashValid(password, user.user_pwd);
      if (!passwordMatch) {
        throw new HttpException ('Invalid credentials', HttpStatus.BAD_REQUEST);
      }

      const { user_pwd, ...result } = user;
      return result;
    }

    async login(): Promise<any> {
      return {
        message: 'Login successful',
        code: HttpStatus.OK,
      };
    }

    async logout(@Req() request: Request): Promise<any> {
      request.session.destroy(() => {
        return {
          message: 'Logout successful',
          statusCode: HttpStatus.OK,
        };
      });
    }
}
