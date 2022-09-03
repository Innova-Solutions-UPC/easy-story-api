import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QualificationsService } from './qualifications.service';
import { CreateQualificationDto } from './dto/create-qualification.dto';
import { UpdateQualificationDto } from './dto/update-qualification.dto';

@Controller('qualifications')
export class QualificationsController {
  constructor(private readonly qualificationsService: QualificationsService) {}

  @Post()
  create(@Body() createQualificationDto: CreateQualificationDto) {
    return this.qualificationsService.create(createQualificationDto);
  }

  @Get()
  findAll() {
    return this.qualificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.qualificationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQualificationDto: UpdateQualificationDto) {
    return this.qualificationsService.update(+id, updateQualificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.qualificationsService.remove(+id);
  }
}
