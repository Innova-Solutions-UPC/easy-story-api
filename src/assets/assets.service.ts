import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Endpoint, S3, Credentials } from 'aws-sdk';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Asset } from './entities/asset.entity';
import { AssetType } from './enums/asset-type.enum';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetsRepository: Repository<Asset>,
  ) {}

  /**
   * It takes a file and an owner, and then uploads the file to Digital Ocean Spaces, and then creates
   * an asset in the database
   * @param file - Express.Multer.File - This is the file that was uploaded.
   * @param {User} owner - User - This is the user who is uploading the file.
   * @returns a promise of an asset.
   */
  async uploadFile(file: Express.Multer.File, owner: User): Promise<Asset> {
    /* This is checking to make sure that the file is not null, that the file is not too big, and that
    the file type is supported. */
    if (!file) {
      throw new BadRequestException('File is required');
    }
    if (file.size > 1000000) {
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
      const asset = this.assetsRepository.create({
        src: data.Location,
        name: file.originalname,
        type: file.mimetype.includes('image')
          ? AssetType.IMAGE
          : AssetType.VIDEO,
        mimetype: file.mimetype,
        owner,
      });
      return this.assetsRepository.save(asset);
    } catch (err) {
      throw new BadRequestException('Error while uploading file');
    }
  }

  /**
   * It returns a promise that resolves to an array of assets that belong to the user
   * @param {User} owner - User - this is the user object that we are passing in from the controller.
   * @returns An array of assets
   */
  getUserAssets(owner: User): Promise<Asset[]> {
    return this.assetsRepository.find({ where: { owner: { id: owner.id } } });
  }

  /**
   * It finds an asset by its id and owner, and if it doesn't exist, it throws a BadRequestException
   * @param {number} id - number - the id of the asset we want to preload
   * @param {User} owner - User - this is the user that is currently logged in.
   * @returns The asset
   */
  async preloadAssetByIdAndOwner(id: number, owner: User): Promise<Asset> {
    const asset = await this.assetsRepository.findOneBy({
      id,
      owner: { id: owner.id },
    });
    if (!asset) {
      throw new BadRequestException('Asset not found');
    }
    return asset;
  }
}
