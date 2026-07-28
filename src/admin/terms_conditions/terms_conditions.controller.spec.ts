import { Test, TestingModule } from '@nestjs/testing';
import { TermsConditionsController } from './terms_conditions.controller';

describe('TermsConditionsController', () => {
  let controller: TermsConditionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TermsConditionsController],
    }).compile();

    controller = module.get<TermsConditionsController>(TermsConditionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
