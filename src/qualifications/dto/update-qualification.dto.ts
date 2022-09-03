import { PartialType } from '@nestjs/mapped-types';
import { CreateQualificationDto } from './create-qualification.dto';

export class UpdateQualificationDto extends PartialType(CreateQualificationDto) {}
