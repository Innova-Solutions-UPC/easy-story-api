import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateHashtagDto {
  @Transform(({ value }) => value.toLowerCase())
  @IsString()
  name: string;
}
