import { Transform } from 'class-transformer';
import { IsArray, IsDecimal, IsEnum, IsString, IsUrl } from 'class-validator';
import { PostStatus } from '../enums/post-status.enum';

export class CreatePostDto {
  @Transform(({ value }) => value.toUpperCamelCase())
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(PostStatus)
  status: PostStatus;

  @IsString()
  content: string;

  @IsArray()
  assets: AssignAssetDto[];

  @IsDecimal()
  pricingValue: number;

  @IsString()
  pricingCurrency: string;

  @IsString()
  pricingDescription: string;

  @IsString({ each: true })
  hashtags: string[];
}

export class AssignAssetDto {
  @IsUrl()
  src: string;
}
