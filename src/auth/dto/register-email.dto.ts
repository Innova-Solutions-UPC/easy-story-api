import {
  IsAlphanumeric,
  IsEmail,
  IsLowercase,
  IsString,
  Length,
  MaxLength,
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

  @MaxLength(50)
  @IsString()
  firstName: string;

  @MaxLength(50)
  @IsString()
  lastName: string;

  @IsString()
  image: string;

  @MaxLength(250)
  @IsString()
  bio: string;
}
