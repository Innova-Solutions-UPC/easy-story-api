import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { UsersModule } from '../users/users.module';
import { PostMetadata } from './entities/post-metadata.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostMetadata]), UsersModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
