import { Test, TestingModule } from '@nestjs/testing';
import { MemberManagementService } from './member_management.service';

describe('MemberManagementService', () => {
  let service: MemberManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberManagementService],
    }).compile();

    service = module.get<MemberManagementService>(MemberManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
