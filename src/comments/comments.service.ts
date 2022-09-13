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
    postSlug: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const post = await this.postsService.findOneBySlug(postSlug);
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
    postSlug: string,
    options: IPaginationOptions,
  ): Promise<Pagination<Comment>> {
    const post = await this.postsService.findOneBySlug(postSlug);
    return paginate<Comment>(this.commentsRepository, options, {
      post: {
        id: post.id,
      },
      relations: {
        user: true,
      },
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

  /**
   * It updates a comment with the given id, if the comment belongs to the given user
   * @param {number} id - The id of the comment to update
   * @param {User} user - User - the user object that is passed in from the auth guard
   * @param {UpdateCommentDto} updateCommentDto - UpdateCommentDto
   * @returns The updated comment
   */
  async update(
    id: number,
    user: User,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.findOne(id);
    if (comment.user.id !== user.id) {
      throw new BadRequestException('You cannot edit this comment');
    }
    return this.commentsRepository.save({
      ...comment,
      content: updateCommentDto.content,
    });
  }

  /**
   * If the comment's user id is not the same as the user id passed in, throw an error. Otherwise,
   * delete the comment
   * @param {number} id - number - the id of the comment we want to delete
   * @param {User} user - User - this is the user that is currently logged in.
   * @returns The comment that was deleted.
   */
  async remove(id: number, user: User) {
    const comment = await this.findOne(id);
    if (comment.user.id !== user.id) {
      throw new BadRequestException('You cannot delete this comment');
    }
    return this.commentsRepository.remove(comment);
  }
}
