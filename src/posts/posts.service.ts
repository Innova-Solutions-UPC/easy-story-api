import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { HashtagsService } from '../hashtags/hashtags.service';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { PostStatus } from './enums/post-status.enum';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly usersService: UsersService,
    private readonly hashtagsService: HashtagsService,
  ) {}
  /**
   * We're creating a new post, and we're using the createPostDto to create the post.
   *
   * We're also using the hashtagsService to preload the hashtags.
   *
   * We're also using the postsRepository to save the post.
   * @param {User} author - User - The user who created the post.
   * @param {CreatePostDto} createPostDto - This is the DTO that we created earlier.
   * @returns A promise of a post
   */
  async create(author: User, createPostDto: CreatePostDto): Promise<Post> {
    const hashtags = await Promise.all(
      createPostDto.hashtags.map((name) =>
        this.hashtagsService.preloadHashtagByName(name.toLowerCase()),
      ),
    );
    const post = this.postsRepository.create({
      ...createPostDto,
      slug:
        createPostDto.title.replace(/\s/g, '-').toLowerCase() +
        '-' +
        Math.random().toString(36).substring(2, 7),
      author: author,
      metadata: {
        views: 0,
        shares: 0,
      },
      hashtags,
    });
    return this.postsRepository.save(post);
  }

  /**
   * It returns a promise of a paginated list of posts, where the posts are filtered by status, and the
   * relations are eager loaded
   * @param {IPaginationOptions} options - IPaginationOptions - This is the options object that is
   * passed to the paginate function.
   * @returns A promise of a pagination object.
   */
  findAll(options: IPaginationOptions): Promise<Pagination<Post>> {
    return paginate<Post>(this.postsRepository, options, {
      where: { status: PostStatus.DRAFT },
      relations: ['author', 'hashtags', 'metadata'],
    });
  }

  async findAllByAuthor(authorId: number): Promise<Post[]> {
    const author = await this.usersService.findOne(authorId);
    return this.postsRepository.find({ where: { author } });
  }

  /**
   * It finds a post by its id, and if it doesn't exist, it throws an error
   * @param {number} id - number - The id of the post we want to find.
   * @returns A post object
   */
  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('Post #${id} not found');
    }
    return post;
  }

  /**
   * Find a post by its slug, and if it doesn't exist, throw an error.
   * @param {string} slug - string - The slug of the post we want to find.
   * @returns A post object
   */
  async findOneBySlug(slug: string): Promise<Post> {
    const post = await this.postsRepository.findOneBy({ slug });
    if (!post) {
      throw new NotFoundException('Post #${id} not found');
    }
    return post;
  }

  /**
   * It updates a post by id, and returns the updated post
   * @param {number} id - number - the id of the post to update
   * @param {User} user - User - the user who is making the request
   * @param {UpdatePostDto} updatePostDto - UpdatePostDto
   * @returns The updated post
   */
  async update(
    id: number,
    user: User,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    const userIsAuthor = await this.postsRepository.findOne({
      where: { id, author: user },
      relations: ['author'],
    });
    if (!userIsAuthor) {
      throw new NotFoundException('You are not the author of this post');
    }
    const hashtags =
      updatePostDto.hashtags &&
      (await Promise.all(
        updatePostDto.hashtags.map((name) =>
          this.hashtagsService.preloadHashtagByName(name.toLowerCase()),
        ),
      ));
    const post = await this.postsRepository.preload({
      id: id,
      author: user,
      ...updatePostDto,
      hashtags,
    });
    if (!post) {
      throw new NotFoundException('Post #${id} not found');
    }

    return this.postsRepository.save(post);
  }

  /**
   * If the post exists, and the user is the author of the post, then delete the post
   * @param {number} id - number - the id of the post we want to delete
   * @param {User} user - User - This is the user that is currently logged in.
   * @returns The post that was deleted.
   */
  async remove(id: number, user: User): Promise<Post> {
    const post = await this.findOne(id);
    if (post.author.id !== user.id) {
      throw new NotFoundException('You are not the author of this post');
    }
    return this.postsRepository.remove(post);
  }
}
