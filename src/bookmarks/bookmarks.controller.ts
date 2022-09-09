import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@ApiTags('Bookmarks')
@Controller({
  path: 'bookmarks',
  version: '1',
})
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a bookmark from a post',
  })
  @ApiBearerAuth()
  create(@Query() query: CreateBookmarkDto, @CurrentUser() user: User) {
    return this.bookmarksService.create(query, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Get a list of bookmarks from a post and user',
  })
  @ApiBearerAuth()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: 10,
    @CurrentUser() currentUser: User,
    @Query('post') post?: string,
  ) {
    return this.bookmarksService.findAll(
      {
        page,
        limit,
        route: '/v1/bookmarks',
      },
      currentUser,
      post,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a bookmark',
  })
  @ApiBearerAuth()
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.bookmarksService.remove(+id, user);
  }
}
