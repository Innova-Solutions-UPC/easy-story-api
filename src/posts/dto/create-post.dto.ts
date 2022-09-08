import { IsEnum, IsString } from 'class-validator';
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

  @IsString()
  image: string;

  @IsString({ each: true })
  hashtags: string[];
}
