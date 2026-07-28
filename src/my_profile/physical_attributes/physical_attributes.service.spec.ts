import { Test, TestingModule } from '@nestjs/testing';
import { PhysicalAttributesService } from './physical_attributes.service';

describe('PhysicalAttributesService', () => {
  let service: PhysicalAttributesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhysicalAttributesService],
    }).compile();

    service = module.get<PhysicalAttributesService>(PhysicalAttributesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
