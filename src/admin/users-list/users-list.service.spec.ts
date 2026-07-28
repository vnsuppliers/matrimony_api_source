import { Test, TestingModule } from '@nestjs/testing';
import { UsersListService } from './users-list.service';

describe('UsersListService', () => {
  let service: UsersListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersListService],
    }).compile();

    service = module.get<UsersListService>(UsersListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
