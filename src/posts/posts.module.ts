import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { UsersModule } from '../users/users.module';
import { PostMetadata } from './entities/post-metadata.entity';
import { HashtagsModule } from '../hashtags/hashtags.module';
import { PostAsset } from './entities/post-asset.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostAsset, PostMetadata]),
    UsersModule,
    HashtagsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
