import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionManagementController } from './profession_management.controller';

describe('ProfessionManagementController', () => {
  let controller: ProfessionManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessionManagementController],
    }).compile();

    controller = module.get<ProfessionManagementController>(
      ProfessionManagementController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
