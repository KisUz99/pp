import { IsString, IsEmail } from 'class-validator';

export class UserDto {
  @IsString()
  id: string;

  @IsString()
  user_name: string;

  @IsEmail()
  email: string;

  @IsString()
  user_pwd: string;
}
