import { Test, TestingModule } from '@nestjs/testing';
import { EducationInfoController } from './education_info.controller';

describe('EducationInfoController', () => {
  let controller: EducationInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EducationInfoController],
    }).compile();

    controller = module.get<EducationInfoController>(EducationInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
