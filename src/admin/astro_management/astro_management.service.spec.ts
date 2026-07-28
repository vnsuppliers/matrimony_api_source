import { Test, TestingModule } from '@nestjs/testing';
import { AstroManagementService } from './astro_management.service';

describe('AstroManagementService', () => {
  let service: AstroManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AstroManagementService],
    }).compile();

    service = module.get<AstroManagementService>(AstroManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
