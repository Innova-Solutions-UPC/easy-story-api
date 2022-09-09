import {
  IsAlphanumeric,
  IsEmail,
  IsLowercase,
  IsString,
  Length,
} from 'class-validator';

export class RegisterEmailDto {
  @IsAlphanumeric()
  @IsLowercase()
  username: string;

  @IsEmail()
  @IsLowercase()
  email: string;

  @Length(8, 50)
  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
