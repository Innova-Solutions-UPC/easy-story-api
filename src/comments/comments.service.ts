import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostStatus } from 'src/posts/enums/post-status.enum';
import { PostsService } from 'src/posts/posts.service';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly postsService: PostsService,
  ) {}
  async create(
    user: User,
    postId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const post = await this.postsService.findOne(postId);
    if (post.status !== PostStatus.PUBLISHED) {
      throw new BadRequestException('You cannot comment on a draft post');
    }
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      post,
      user,
    });
    return this.commentsRepository.save(comment);
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
