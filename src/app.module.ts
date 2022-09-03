import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { HashtagsModule } from './hashtags/hashtags.module';
import { QualificationsModule } from './qualifications/qualifications.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [UsersModule, PostsModule, CommentsModule, BookmarksModule, HashtagsModule, QualificationsModule, SubscriptionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
