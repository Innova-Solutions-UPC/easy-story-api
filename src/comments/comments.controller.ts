import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { get } from 'http';
import { CurrentUser } from '../common/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comments')
@Controller({
  version: '1',
})
@UseInterceptors(ClassSerializerInterceptor)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/posts/:slug/comments')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new comment on a post' })
  create(
    @Param('slug') slug: string,
    @CurrentUser() user: User,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    console.log('aaa')
    return this.commentsService.create(user, slug, createCommentDto);
  }

  @Get('/posts/:slug/comments')
  @ApiOperation({ summary: 'Get all comments in a post' })
  findAllByPost(
    @Param('slug') slug: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: 10,
  ) {
    console.log('ssssss')
    return this.commentsService.findAllByPost(slug, {
      page,
      limit,
      route: `/v1/posts/${slug}/comments`,
    });
  }

  @Get('/comments/:id')
  @ApiOperation({ summary: 'Get an specific comment' })
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch('/comments/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a comment that you made in a post' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(+id, user, updateCommentDto);
  }

  @Delete('/comments/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.commentsService.remove(+id, user);
  }
}
