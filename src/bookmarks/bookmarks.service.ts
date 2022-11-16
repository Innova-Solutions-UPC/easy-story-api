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

  /**
   * If the user is trying to bookmark a post that isn't theirs, throw an error. If the user is trying
   * to bookmark a post that they've already bookmarked, throw an error. Otherwise, create a new
   * bookmark and save it to the database
   * @param {CreateBookmarkDto} createBookmarkDto - CreateBookmarkDto
   * @param {User} user - User - This is the user object that was retrieved from the JWT token.
   * @returns The bookmark that was created.
   */
  async create(
    createBookmarkDto: CreateBookmarkDto,
    user: User,
  ): Promise<Bookmark> {
    /*if (createBookmarkDto.user && user.id !== +createBookmarkDto.user) {
      throw new BadRequestException('You can only bookmark your own posts');
    }*/
    const existingBookmark = await this.bookmarksRepository.findOneBy({
      user: {
        id: user.id,
      },
      post: { id: +createBookmarkDto.post },
    });
    if (existingBookmark) {
      throw new BadRequestException('You already bookmarked this post');
    }
    const bookmark = this.bookmarksRepository.create({
      post: { id: +createBookmarkDto.post },
      user: user,
    });
    return this.bookmarksRepository.save(bookmark);
  }

  /**
   * It returns a paginated list of bookmarks for the current user, optionally filtered by post
   * @param {IPaginationOptions} options - IPaginationOptions - This is the options object that we pass
   * to the paginate function.
   * @param {User} currentUser - The user who is making the request.
   * @param {string} [postId] - The id of the post to filter by.
   * @returns A paginated list of bookmarks.
   */
  findAll(
    options: IPaginationOptions,
    currentUser: User,
    postSlug?: string,
  ): Promise<Pagination<Bookmark>> {
    const query: FindManyOptions<Bookmark> = {
      where: {
        user: {
          id: currentUser.id,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    };
    if (postSlug) {
      query.where['post'] = { slug: postSlug };
    }
    return paginate<Bookmark>(this.bookmarksRepository, options, query);
  }

  /**
   * It finds a bookmark by its id and throws an error if it doesn't exist
   * @param {number} id - number - the id of the bookmark we want to find
   * @returns A bookmark
   */
  async findOne(id: number): Promise<Bookmark> {
    const bookmark = await this.bookmarksRepository.findOneBy({ id });
    if (!bookmark) {
      throw new BadRequestException('Bookmark not found');
    }
    return bookmark;
  }

  /**
   * If the bookmark's user id is not the same as the user id passed in, throw an error. Otherwise,
   * delete the bookmark
   * @param {number} id - number - The id of the bookmark to delete
   * @param {User} user - User - This is the user that is currently logged in.
   * @returns The removed bookmark
   */
  async remove(id: number, user: User): Promise<Bookmark> {
    const bookmark = await this.findOne(id);
    if (bookmark.user.id !== user.id) {
      throw new BadRequestException('You can only delete your own bookmarks');
    }
    return this.bookmarksRepository.remove(bookmark);
  }
}
