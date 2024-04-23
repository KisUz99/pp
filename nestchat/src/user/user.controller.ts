import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpStatus,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.user(id);
    if (user == null) {
      return {
        message: 'no match user',
        statusCode: HttpStatus.CREATED
      }
    }
    
    return this.excludePwd(user);
  }

  @Post()
  async createUser(@Body() dto: UserDto): Promise<any> {
    console.log('someone trying to create user');
    try {
      const createdUser = await this.userService.createUser({
        ...dto,
        friend_id: null,
        block_id: null,
      });

      console.log('create user success', createdUser);

      return {
        message: 'create user success',
        code: HttpStatus.OK,
        ...this.excludePwd(createdUser)
      };
    } catch (e) {
      console.error(e);
      return {
        message: 'Internal server error occuared',
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @Delete('/:id')
  async deleteUser(@Param('id') uid: string): Promise<User | string> {
    return this.userService.deleteUser(uid);
  }

  excludePwd(user: User): any {
    const { user_pwd, ...result } = user;
    return result;
  }
}
