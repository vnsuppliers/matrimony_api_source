import { Test, TestingModule } from '@nestjs/testing';
import { FamilyInfoController } from './family_info.controller';

describe('FamilyInfoController', () => {
  let controller: FamilyInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FamilyInfoController],
    }).compile();

    controller = module.get<FamilyInfoController>(FamilyInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
