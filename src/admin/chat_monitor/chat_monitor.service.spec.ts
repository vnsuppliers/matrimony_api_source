import { Test, TestingModule } from '@nestjs/testing';
import { ChatMonitorService } from './chat_monitor.service';

describe('ChatMonitorService', () => {
  let service: ChatMonitorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatMonitorService],
    }).compile();

    service = module.get<ChatMonitorService>(ChatMonitorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
