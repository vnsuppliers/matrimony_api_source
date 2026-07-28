import { Test, TestingModule } from '@nestjs/testing';
import { VisitorManagementService } from './visitor_management.service';

describe('VisitorManagementService', () => {
  let service: VisitorManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisitorManagementService],
    }).compile();

    service = module.get<VisitorManagementService>(VisitorManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
