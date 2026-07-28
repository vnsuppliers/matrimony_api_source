import { Test, TestingModule } from '@nestjs/testing';
import { UserBasicInfoController } from './user_basic_info.controller';

describe('UserBasicInfoController', () => {
  let controller: UserBasicInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserBasicInfoController],
    }).compile();

    controller = module.get<UserBasicInfoController>(UserBasicInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
