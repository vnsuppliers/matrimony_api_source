import { Test, TestingModule } from '@nestjs/testing';
import { ReportManagementController } from './report_management.controller';

describe('ReportManagementController', () => {
  let controller: ReportManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportManagementController],
    }).compile();

    controller = module.get<ReportManagementController>(ReportManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
