import { IsISO31661Alpha3, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  bio: string;

  @IsISO31661Alpha3()
  country: string;
}
