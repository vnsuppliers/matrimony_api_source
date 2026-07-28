import { Test, TestingModule } from '@nestjs/testing';
import { MembersListService } from './members_list.service';

describe('MembersListService', () => {
  let service: MembersListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembersListService],
    }).compile();

    service = module.get<MembersListService>(MembersListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
