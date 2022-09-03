import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class LoginEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsBoolean()
  rememberMe: boolean;

  @IsString()
  token: string;
}
