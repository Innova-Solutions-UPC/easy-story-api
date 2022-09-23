import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from '../common/current-user.decorator';
import { AssetsService } from './assets.service';

@ApiBearerAuth()
@ApiTags('Assets Bucket')
@Controller({
  path: 'assets',
  version: '1',
})
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiParam({ name: 'file', type: 'file' })
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    return this.assetsService.uploadFile(file, user);
  }

  @Get('user')
  async getMyAssets(@CurrentUser() user: User) {
    return this.assetsService.getUserAssets(user);
  }
}
