import { Test, TestingModule } from '@nestjs/testing';
import { UsersListController } from './users-list.controller';

describe('UsersListController', () => {
  let controller: UsersListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersListController],
    }).compile();

    controller = module.get<UsersListController>(UsersListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
