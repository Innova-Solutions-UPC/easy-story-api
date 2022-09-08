import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HashtagsService } from './hashtags.service';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Hashtags')
@Controller({ path: 'hashtags', version: '1' })
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  @Post()
  create(@Body() createHashtagDto: CreateHashtagDto) {
    return this.hashtagsService.create(createHashtagDto);
  }

  @Get()
  findAll() {
    return this.hashtagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hashtagsService.findOne(+id);
  }
}
