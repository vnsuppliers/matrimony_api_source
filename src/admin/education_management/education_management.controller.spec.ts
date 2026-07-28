import { Test, TestingModule } from '@nestjs/testing';
import { EducationManagementController } from './education_management.controller';

describe('EducationManagementController', () => {
  let controller: EducationManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EducationManagementController],
    }).compile();

    controller = module.get<EducationManagementController>(EducationManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
