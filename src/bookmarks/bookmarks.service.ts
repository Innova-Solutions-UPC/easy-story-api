import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { Bookmark } from './entities/bookmark.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarksRepository: Repository<Bookmark>,
  ) {}
  create(createBookmarkDto: CreateBookmarkDto, user: User): Promise<Bookmark> {
    if (createBookmarkDto.user && user.id !== +createBookmarkDto.user) {
      throw new BadRequestException('You can only bookmark your own posts');
    }
    const bookmark = this.bookmarksRepository.create({
      post: { id: +createBookmarkDto.post },
      user: user,
    });
    return this.bookmarksRepository.save(bookmark);
  }

  findAll(
    options: IPaginationOptions,
    currentUser: User,
    postId?: string,
  ): Promise<Pagination<Bookmark>> {
    const query: FindManyOptions<Bookmark> = {
      where: {
        user: currentUser,
      },
      order: {
        createdAt: 'DESC',
      },
    };
    if (postId) {
      query.where['post'] = { id: +postId };
    }
    return paginate<Bookmark>(this.bookmarksRepository, options, query);
  }

  async findOne(id: number): Promise<Bookmark> {
    const bookmark = await this.bookmarksRepository.findOneBy({ id });
    if (!bookmark) {
      throw new BadRequestException('Bookmark not found');
    }
    return bookmark;
  }

  async remove(id: number, user: User): Promise<Bookmark> {
    const bookmark = await this.findOne(id);
    if (bookmark.user.id !== user.id) {
      throw new BadRequestException('You can only delete your own bookmarks');
    }
    return this.bookmarksRepository.remove(bookmark);
  }
}
