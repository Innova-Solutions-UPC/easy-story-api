import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { HashtagsModule } from './hashtags/hashtags.module';
import { QualificationsModule } from './qualifications/qualifications.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: `${process.env.DATABASE_URL}`,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    PostsModule,
    CommentsModule,
    BookmarksModule,
    HashtagsModule,
    QualificationsModule,
    SubscriptionsModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
