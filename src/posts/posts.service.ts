import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { FindManyOptions, FindOptionsWhere, Like, Repository } from 'typeorm';
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
import { Cron } from '@nestjs/schedule';
import { PostAsset } from './entities/post-asset.entity';
import { Credentials, Endpoint, S3 } from 'aws-sdk';
import { PostAssetType } from './enums/post-asset-type.enum';

@Injectable()
export class PostsService {
  /* It's creating a new logger instance, and it's using the name of the class as the name of the
  logger. */
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(PostAsset)
    private readonly postAssetsRepository: Repository<PostAsset>,
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
    const user = await this.usersService.findOne(author.username);
    const assets = await Promise.all(
      createPostDto.assets.map((asset) =>
        this.preloadAssetBySrcAndOwner(asset.src, author),
      ),
    );
    const post = this.postsRepository.create({
      ...createPostDto,
      slug:
        createPostDto.title.replace(/\s/g, '-') +
        '-' +
        Math.random().toString(36).substring(2, 7),
      author: user,
      hashtags: hashtags,
      assets: assets,
      metadata: {
        views: 0,
        shares: 0,
      },
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
  async findAll(
    options: IPaginationOptions,
    author?: string,
    hashtag?: string,
    currentUser?: User,
  ): Promise<Pagination<Post>> {
    const query: FindManyOptions<Post> = {
      relations: {
        author: true,
        hashtags: true,
      },
      where: {
        status: PostStatus.PUBLISHED,
      } as FindOptionsWhere<Post>,
      order: {
        createdAt: 'DESC',
      },
    };
    if (author) {
      query.where['author'] = { username: author };
    }
    if (hashtag) {
      query.where['hashtags'] = { name: hashtag };
    }
    if (currentUser) {
      delete query.where['status'];
      query.where['author'] = { username: currentUser.username };
    }
    return paginate<Post>(this.postsRepository, options, query);
  }
  /**
   * It returns a promise of a paginated list of posts, where the posts are filtered by status, and the
   * relations are eager loaded
   * @param {IPaginationOptions} options - IPaginationOptions - This is the options object that is
   * passed to the paginate function.
   * @returns A promise of a pagination object.
   */
  async search(
    options: IPaginationOptions,
    title: string,
    country?: string,
  ): Promise<Pagination<Post>> {
    const query: FindManyOptions<Post> = {
      relations: {
        author: true,
        hashtags: true,
      },
      where: {
        status: PostStatus.PUBLISHED,
        title: Like(`%${title.toLowerCase()}%`),
      } as FindOptionsWhere<Post>,
      order: {
        createdAt: 'DESC',
      },
    };
    if (country) {
      query.where['author.country'] = country;
    }
    return paginate<Post>(this.postsRepository, options, query);
  }

  /**
   * It finds a PostAsset by its src and owner
   * @param {string} src - The source of the asset.
   * @param {User} owner - User - the user who owns the asset
   * @returns A PostAsset object
   */
  async preloadAssetBySrcAndOwner(
    src: string,
    owner: User,
  ): Promise<PostAsset> {
    const asset = await this.postAssetsRepository.findOne({
      where: { src: src, owner: { id: owner.id } },
    });
    console.log(asset);
    if (!asset) {
      throw new NotFoundException(`Asset ${src} not found`);
    }
    return asset;
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
    const post = await this.postsRepository.findOneBy({
      slug,
      status: PostStatus.PUBLISHED,
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    /* It's updating the views of the post. */
    post.metadata.views++;
    await this.postsRepository.save(post);
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
    author: User,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    const userIsAuthor = await this.postsRepository.findOne({
      where: {
        id: id,
        author: {
          id: author.id,
        },
      },
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
    const assets = await Promise.all(
      updatePostDto.assets.map((asset) =>
        this.preloadAssetBySrcAndOwner(asset.src, author),
      ),
    );
    const post = await this.postsRepository.preload({
      id: id,
      author: author,
      title: updatePostDto.title,
      content: updatePostDto.content,
      status: updatePostDto.status,
      hashtags: hashtags,
      assets: assets,
    });
    if (!post) {
      throw new NotFoundException('Post #${id} not found');
    }
    return this.postsRepository.save(post);
  }

  /**
   * It takes a file and an owner, and then uploads the file to Digital Ocean Spaces, and then creates
   * an asset in the database
   * @param file - Express.Multer.File - This is the file that was uploaded.
   * @param {User} owner - User - This is the user who is uploading the file.
   * @returns a promise of an asset.
   */
  async uploadFile(file: Express.Multer.File, owner: User): Promise<PostAsset> {
    /* This is checking to make sure that the file is not null, that the file is not too big, and that
    the file type is supported. */
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const fileSize = file.size / 1024 / 1024;
    if (fileSize > 25) {
      // 25 MB
      throw new BadRequestException('File is too big');
    }
    if (
      file.mimetype !== 'image/jpeg' &&
      file.mimetype !== 'image/png' &&
      file.mimetype !== 'image/webp' &&
      file.mimetype !== 'media/mp4'
    ) {
      throw new BadRequestException('File type is not supported');
    }
    /* This is creating a new S3 object with the credentials and endpoint. */
    const spaceEndPoint = new Endpoint(`${process.env.DO_SPACE_ENDPOINT}`);
    const space = new S3({
      endpoint: spaceEndPoint.href,
      credentials: new Credentials({
        accessKeyId: process.env.DO_SPACE_ACCESS_KEY_ID,
        secretAccessKey: process.env.DO_SPACE_SECRET_ACCESS,
      }),
    });
    /* This is creating a new S3 object with the credentials and endpoint. */
    const date_time = new Date();
    file.originalname =
      date_time.getUTCHours().toString() +
      date_time.getUTCMinutes().toString() +
      date_time.getUTCSeconds().toString() +
      '-' +
      file.originalname.replace(/\s/g, '_');
    const fileName = `uploads/${date_time
      .getUTCFullYear()
      .toString()}/${date_time.getUTCMonth().toString()}/${date_time
      .getUTCDay()
      .toString()}/${file.originalname}`;
    const params = {
      Bucket: process.env.DO_SPACE_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
      UserMetadata: {
        owner: owner.id,
      },
    };
    /* This is a try catch block. It is trying to upload the file to Digital Ocean Spaces, and if it
    fails, it throws an error. */
    try {
      const data = await space.upload(params).promise();
      const asset = this.postAssetsRepository.create({
        src: data.Location,
        name: file.originalname,
        size: file.size,
        type: file.mimetype.includes('image')
          ? PostAssetType.IMAGE
          : PostAssetType.VIDEO,
        mimetype: file.mimetype,
        owner,
      });
      return this.postAssetsRepository.save(asset);
    } catch (err) {
      throw new BadRequestException('Error while uploading file');
    }
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

  @Cron('45 * * * * *')
  async handleDynamicList() {
    this.logger.log('Updating dynamic list of Posts');
    const posts = await this.postsRepository.find();
    this.logger.log(`Finished updating list, found ${posts.length} posts`);
    return posts;
  }
}
