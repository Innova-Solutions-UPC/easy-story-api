import { Module } from '@nestjs/common';
import { QualificationsService } from './qualifications.service';
import { QualificationsController } from './qualifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Qualification } from './entities/qualification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Qualification])],
  controllers: [QualificationsController],
  providers: [QualificationsService],
})
export class QualificationsModule {}
