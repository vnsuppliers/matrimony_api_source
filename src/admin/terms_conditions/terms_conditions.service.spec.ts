import { Test, TestingModule } from '@nestjs/testing';
import { TermsConditionsService } from './terms_conditions.service';

describe('TermsConditionsService', () => {
  let service: TermsConditionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TermsConditionsService],
    }).compile();

    service = module.get<TermsConditionsService>(TermsConditionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
