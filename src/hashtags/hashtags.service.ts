import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { UpdateHashtagDto } from './dto/update-hashtag.dto';
import { Hashtag } from './entities/hashtag.entity';

@Injectable()
export class HashtagsService {
  constructor(
    @InjectRepository(Hashtag)
    private readonly hashtagsRepository: Repository<Hashtag>,
  ) {}
  create(createHashtagDto: CreateHashtagDto) {
    return 'This action adds a new hashtag';
  }

  findAll() {
    return `This action returns all hashtags`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hashtag`;
  }

  async preloadHashtagByName(name: string): Promise<Hashtag> {
    const hashtag = await this.hashtagsRepository.findOne({
      where: { name: name.toLowerCase() },
    });
    if (hashtag) {
      return hashtag;
    }
    return this.hashtagsRepository.create({ name });
  }
}
