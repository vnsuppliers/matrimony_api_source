import { Test, TestingModule } from '@nestjs/testing';
import { MemberManagementController } from './member_management.controller';

describe('MemberManagementController', () => {
  let controller: MemberManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberManagementController],
    }).compile();

    controller = module.get<MemberManagementController>(MemberManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
