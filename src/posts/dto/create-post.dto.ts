import {
  IsArray,
  IsDecimal,
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';
import { PostStatus } from '../enums/post-status.enum';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(PostStatus)
  status: PostStatus;

  @IsString()
  content: string;

  @IsArray()
  gallery: AssignAssetDto[];

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
  @IsNumber()
  id: string;
}
