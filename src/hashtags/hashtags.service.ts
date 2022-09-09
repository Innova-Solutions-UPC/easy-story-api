import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { Hashtag } from './entities/hashtag.entity';

@Injectable()
export class HashtagsService {
  constructor(
    @InjectRepository(Hashtag)
    private readonly hashtagsRepository: Repository<Hashtag>,
  ) {}
  create(createHashtagDto: CreateHashtagDto): Promise<Hashtag> {
    const hashtag = this.hashtagsRepository.create(createHashtagDto);
    return this.hashtagsRepository.save(hashtag);
  }

  findAll(options: IPaginationOptions): Promise<Pagination<Hashtag>> {
    return paginate<Hashtag>(this.hashtagsRepository, options);
  }

  async findOneByName(name: string): Promise<Hashtag> {
    const hashtag = await this.hashtagsRepository.findOneBy({
      name: name.toLowerCase(),
    });
    if (!hashtag) {
      throw new NotFoundException(`Hashtag #${name} not found`);
    }
    return hashtag;
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
