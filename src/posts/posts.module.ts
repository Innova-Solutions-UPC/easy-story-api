import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { UsersModule } from '../users/users.module';
import { PostMetadata } from './entities/post-metadata.entity';
import { HashtagsModule } from '../hashtags/hashtags.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostMetadata]),
    UsersModule,
    HashtagsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
