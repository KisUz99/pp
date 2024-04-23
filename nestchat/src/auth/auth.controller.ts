import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard, LocalAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(): Promise<any> {
    return this.authService.login();
  }

  @Get('/logout')
  logout(@Req() req: Request): Promise<any> {
    return this.authService.logout(req);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('test')
  isAuthenticated() {
    return {
      message: 'hi'
    };
  }
}
