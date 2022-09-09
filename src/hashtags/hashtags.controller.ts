import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { HashtagsService } from './hashtags.service';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/public.decorator';

@ApiTags('Hashtags')
@Controller({ path: 'hashtags', version: '1' })
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new hashtag' })
  create(@Body() createHashtagDto: CreateHashtagDto) {
    return this.hashtagsService.create(createHashtagDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Retrieve all hashtags' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: 10,
  ) {
    return this.hashtagsService.findAll({
      page,
      limit,
      route: '/v1/hashtags',
    });
  }

  @Get(':name')
  @Public()
  @ApiOperation({ summary: 'Get a hashtag by name' })
  findOneByName(@Param('name') name: string) {
    return this.hashtagsService.findOneByName(name);
  }
}
