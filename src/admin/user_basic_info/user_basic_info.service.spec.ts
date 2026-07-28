import { Test, TestingModule } from '@nestjs/testing';
import { UserBasicInfoService } from './user_basic_info.service';

describe('UserBasicInfoService', () => {
  let service: UserBasicInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserBasicInfoService],
    }).compile();

    service = module.get<UserBasicInfoService>(UserBasicInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
