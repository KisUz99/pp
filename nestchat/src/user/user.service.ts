import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { hash } from 'src/util/crypt.util';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(id: string): Promise<User> | null {
    const filter = {
      where: {
        id
      },
    };
    const user = await this.prisma.user.findUnique(filter);
    console.dir(user);
    return user;   
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    data.user_pwd = hash(data.user_pwd);
    return await this.prisma.user.create({
      data,
    });
  }

  async deleteUser(uid: string) {
    try {
      const filter = {
        where: {
          uid: Number(uid),
        },
      };
      const isExist = (await this.prisma.user.count(filter)) > 0;
      if (isExist) {
        return await this.prisma.user.delete(filter);
      } else {
        return 'user not exist';
      }
    } catch (e) {
      return 'server error';
    }
  }
}
