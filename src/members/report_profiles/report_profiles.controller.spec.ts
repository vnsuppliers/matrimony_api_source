import { Test, TestingModule } from '@nestjs/testing';
import { ReportProfilesController } from './report_profiles.controller';

describe('ReportProfilesController', () => {
  let controller: ReportProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportProfilesController],
    }).compile();

    controller = module.get<ReportProfilesController>(ReportProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
