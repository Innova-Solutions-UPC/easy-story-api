import { IsEmail, IsString } from 'class-validator';

export class LoginEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
