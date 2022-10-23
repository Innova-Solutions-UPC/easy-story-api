import { IsString, MaxLength } from 'class-validator';

export class CreateProfileDto {
  @MaxLength(50)
  @IsString()
  firstName: string;

  @MaxLength(50)
  @IsString()
  lastName: string;

  @MaxLength(250)
  @IsString()
  bio: string;
}
