import { Test, TestingModule } from '@nestjs/testing';
import { ChatMonitorController } from './chat_monitor.controller';

describe('ChatMonitorController', () => {
  let controller: ChatMonitorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatMonitorController],
    }).compile();

    controller = module.get<ChatMonitorController>(ChatMonitorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
