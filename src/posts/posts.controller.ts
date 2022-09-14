import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Public } from '../common/public.decorator';

@ApiTags('Posts')
@Controller({
  version: '1',
})
@UseInterceptors(ClassSerializerInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('posts')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post' })
  create(@CurrentUser() user: User, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(user, createPostDto);
  }

  @Get('posts')
  @Public()
  @ApiOperation({ summary: 'Retrieve all posts' })
  @ApiQuery({
    name: 'author',
    required: false,
    type: Number,
    description: 'The author id',
  })
  @ApiQuery({
    name: 'hashtag',
    required: false,
    type: String,
    description: 'The hashtag name',
  })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: 10,
    @Query('author') author?: string,
    @Query('hashtag') hashtag?: string,
  ) {
    return this.postsService.findAll(
      {
        page,
        limit,
        route: '/v1/posts',
      },
      +author,
      hashtag,
      null,
    );
  }

  @Get('user-posts')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all posts by the authenticated user' })
  @ApiQuery({
    name: 'hashtag',
    required: false,
    type: String,
    description: 'The hashtag name',
  })
  findAllByCurrentUser(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: 10,
    @CurrentUser() user: User,
    @Query('hashtag') hashtag?: string,
  ) {
    return this.postsService.findAll(
      {
        page,
        limit,
        route: '/v1/posts',
      },
      null,
      hashtag,
      user,
    );
  }

  @Public()
  @Get('posts/:slug')
  @ApiOperation({ summary: 'Get a post by slug' })
  findOneBySlug(@Param('slug') slug: string) {
    return this.postsService.findOneBySlug(slug);
  }

  @Patch('posts/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a post' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(+id, user, updatePostDto);
  }

  @Public()
  @Patch('posts/:id/metadata')
  @ApiOperation({ summary: 'Post metadata' })
  updateMetadata(@Param('id') id: string, @Query('action') action: string) {
    return this.postsService.updateMetadata(+id, action);
  }

  @Delete('posts/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a post' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.postsService.remove(+id, user);
  }
}
