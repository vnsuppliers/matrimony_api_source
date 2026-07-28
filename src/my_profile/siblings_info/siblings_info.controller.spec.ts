import { Test, TestingModule } from '@nestjs/testing';
import { SiblingsInfoController } from './siblings_info.controller';

describe('SiblingsInfoController', () => {
  let controller: SiblingsInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SiblingsInfoController],
    }).compile();

    controller = module.get<SiblingsInfoController>(SiblingsInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
