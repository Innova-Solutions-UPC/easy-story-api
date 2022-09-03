import { Test, TestingModule } from '@nestjs/testing';
import { QualificationsService } from './qualifications.service';

describe('QualificationsService', () => {
  let service: QualificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QualificationsService],
    }).compile();

    service = module.get<QualificationsService>(QualificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
