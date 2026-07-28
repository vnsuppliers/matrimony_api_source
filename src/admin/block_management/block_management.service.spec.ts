import { Test, TestingModule } from '@nestjs/testing';
import { BlockManagementService } from './block_management.service';

describe('BlockManagementService', () => {
  let service: BlockManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockManagementService],
    }).compile();

    service = module.get<BlockManagementService>(BlockManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
