import { IsEmail, IsString, Length } from 'class-validator';

export class RegisterEmailDto {
  @IsEmail()
  email: string;

  @Length(8, 50)
  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
