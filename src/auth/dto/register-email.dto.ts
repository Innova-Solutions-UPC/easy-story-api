import {
  IsAlphanumeric,
  IsEmail,
  IsISO31661Alpha3,
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

  @IsString()
  bio: string;

  @IsISO31661Alpha3()
  country: string;
}
