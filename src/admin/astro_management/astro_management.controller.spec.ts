import { Test, TestingModule } from '@nestjs/testing';
import { AstroManagementController } from './astro_management.controller';

describe('AstroManagementController', () => {
  let controller: AstroManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AstroManagementController],
    }).compile();

    controller = module.get<AstroManagementController>(AstroManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
