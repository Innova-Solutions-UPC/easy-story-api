import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { PostAsset } from './entities/post-asset.entity';
import { AssetsController } from './assets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostAsset]), UsersModule],
  providers: [AssetsService],
  controllers: [AssetsController],
  exports: [AssetsService],
})
export class AssetsModule {}
