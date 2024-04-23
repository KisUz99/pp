import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private userService: UserService) {
    super();
  }

  serializeUser(user: any, done: (err, user: User) => void): any {
    console.log('Serialize User');
    done(null, user.id);
  }

  async deserializeUser(id, done: (err, user) => void) {
    console.log ('Deserialize User');
    const user = await this.userService.user(id);
    const { user_pwd, ...userInfo } = user;

    return user ? done(null, userInfo) : done(new Error('No User'), null);
  }
}