import { IsOptional, IsString } from 'class-validator';

export class CreateBookmarkDto {
  /* The ID of the post to bookmark */
  @IsString()
  post: string;

  /* The ID of the user (optional). Default: Current authenticated user */
  @IsOptional()
  @IsString()
  user?: string;
}
