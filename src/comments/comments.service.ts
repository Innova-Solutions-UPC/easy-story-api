import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
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

  /**
   * It creates a comment for a given post, but only if the post is published
   * @param {User} user - User - The user who is creating the comment.
   * @param {number} postId - The ID of the post we want to comment on.
   * @param {CreateCommentDto} createCommentDto - This is the DTO that we created earlier.
   * @returns The comment that was created.
   */
  async create(
    user: User,
    postId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const post = await this.postsService.findOne(postId);
    if (post.status == PostStatus.PUBLISHED) {
      throw new BadRequestException('You cannot comment on a draft post');
    }
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      post,
      user,
    });
    return this.commentsRepository.save(comment);
  }

  /**
   * "Find all comments for a given post, paginated."
   *
   * The first thing we do is find the post. We do this because we need to know the postId to find the
   * comments
   * @param {number} postId - number - The id of the post we want to find comments for.
   * @param {IPaginationOptions} options - IPaginationOptions
   * @returns A paginated list of comments for a given post.
   */
  async findAllByPost(
    postId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<Comment>> {
    const post = await this.postsService.findOne(postId);
    return paginate<Comment>(this.commentsRepository, options, {
      post: post,
      relations: ['user'],
    });
  }

  /**
   * It finds a comment by its id, and if it doesn't exist, it throws an error
   * @param {number} id - number - the id of the comment we want to find
   * @returns A comment
   */
  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['user', 'post'],
    });
    if (!comment) {
      throw new BadRequestException('Comment not found');
    }
    return comment;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
