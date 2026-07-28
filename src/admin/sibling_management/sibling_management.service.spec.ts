import { Test, TestingModule } from '@nestjs/testing';
import { SiblingManagementService } from './sibling_management.service';

describe('SiblingManagementService', () => {
  let service: SiblingManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SiblingManagementService],
    }).compile();

    service = module.get<SiblingManagementService>(SiblingManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
