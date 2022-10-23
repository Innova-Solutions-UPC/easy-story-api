import { IsEmail, IsString } from 'class-validator';

export class LoginEmailDto {
  // User personal email address
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
