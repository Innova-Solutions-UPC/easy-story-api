import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    private readonly usersService: UsersService,
  ) {}
  create(author: User, createPostDto: CreatePostDto) {
    const post = this.postsRepository.create({
      ...createPostDto,
      slug: createPostDto.title.replace(/\s/g, '-').toLowerCase(),
      author: author,
    });
    return this.postsRepository.save(post);
  }

  findAll() {
    return `This action returns all posts`;
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

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
