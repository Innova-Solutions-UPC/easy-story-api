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
import { CurrentUser } from '../common/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comments')
@Controller({
  version: '1',
})
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/posts/:postId/comments')
  @ApiOperation({ summary: 'Create a new comment on a post' })
  create(
    @Param('postId') postId: string,
    @CurrentUser() user: User,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(user, +postId, createCommentDto);
  }

  @Get('/posts/:postId/comments')
  @ApiOperation({ summary: 'Get all comments in a post' })
  findAllByPost(
    @Param('postId') postId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: 10,
  ) {
    return this.commentsService.findAllByPost(+postId, {
      page,
      limit,
      route: `/v1/posts/${postId}/comments`,
    });
  }

  @Get('/comments/:id')
  @ApiOperation({ summary: 'Get an specific comment' })
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch('/comments/:id')
  @ApiOperation({ summary: 'Update a comment' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(+id, user, updateCommentDto);
  }

  @Delete('/comments/:id')
  @ApiOperation({ summary: 'Delete a comment' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.commentsService.remove(+id, user);
  }
}
