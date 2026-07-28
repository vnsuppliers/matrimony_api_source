import { Test, TestingModule } from '@nestjs/testing';
import { MotherTongueService } from './mother_tongue.service';

describe('MotherTongueService', () => {
  let service: MotherTongueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MotherTongueService],
    }).compile();

    service = module.get<MotherTongueService>(MotherTongueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
