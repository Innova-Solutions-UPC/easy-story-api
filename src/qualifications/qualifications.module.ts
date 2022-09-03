import { Module } from '@nestjs/common';
import { QualificationsService } from './qualifications.service';
import { QualificationsController } from './qualifications.controller';

@Module({
  controllers: [QualificationsController],
  providers: [QualificationsService]
})
export class QualificationsModule {}
