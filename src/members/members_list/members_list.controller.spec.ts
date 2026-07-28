import { Test, TestingModule } from '@nestjs/testing';
import { MembersListController } from './members_list.controller';

describe('MembersListController', () => {
  let controller: MembersListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembersListController],
    }).compile();

    controller = module.get<MembersListController>(MembersListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
