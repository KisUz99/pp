import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ChatGateway, RoomGateway } from './app.gateway';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { TestModule } from './test/test.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule,
    PassportModule.register({
      session: true
    }),
    TestModule
  ],
  controllers: [AppController, UserController],
  providers: [AppService, ChatGateway, RoomGateway],
})
export class AppModule {}
