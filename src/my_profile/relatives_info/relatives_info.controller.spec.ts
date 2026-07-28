import { Test, TestingModule } from '@nestjs/testing';
import { RelativesInfoController } from './relatives_info.controller';

describe('RelativesInfoController', () => {
  let controller: RelativesInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelativesInfoController],
    }).compile();

    controller = module.get<RelativesInfoController>(RelativesInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
