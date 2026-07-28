import { Test, TestingModule } from '@nestjs/testing';
import { SpecialisationService } from './specialisation.service';

describe('SpecialisationService', () => {
  let service: SpecialisationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecialisationService],
    }).compile();

    service = module.get<SpecialisationService>(SpecialisationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
