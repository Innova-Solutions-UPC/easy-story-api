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
  async create(author: User, createPostDto: CreatePostDto) {
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

  findAll(options: IPaginationOptions): Promise<Pagination<Post>> {
    return paginate<Post>(this.postsRepository, options, {
      where: { status: PostStatus.DRAFT },
      relations: ['author', 'hashtags', 'metadata'],
    });
  }

  async findAllByAuthor(authorId: number) {
    const author = await this.usersService.findOne(authorId);
    return this.postsRepository.find({ where: { author } });
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('Post #${id} not found');
    }
    return post;
  }

  async findOneBySlug(slug: string) {
    const post = await this.postsRepository.findOneBy({ slug });
    if (!post) {
      throw new NotFoundException('Post #${id} not found');
    }
    return post;
  }

  async update(id: number, user: User, updatePostDto: UpdatePostDto) {
    const userIsAuthor = await this.postsRepository.findOne({
      where: { id, author: user },
      relations: ['author'],
    });
    if (!userIsAuthor) {
      throw new NotFoundException('Post #${id} not found');
    }
    const hashtags = await Promise.all(
      updatePostDto.hashtags.map((name) =>
        this.hashtagsService.preloadHashtagByName(name.toLowerCase()),
      ),
    );

    const post = await this.postsRepository.preload({
      id: id,
      author: user,
      hashtags,
      ...updatePostDto,
    } as Post);
    if (!post) {
      throw new NotFoundException('Post #${id} not found');
    }

    return { updatePostDto };
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
