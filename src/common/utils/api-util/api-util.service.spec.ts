import { TestingModule } from '@nestjs/testing';
import { ApiUtilService } from './api-util.service';
import { AutoMockingModule } from '../../../../test/auto-mocking/auto-mocking.module';

describe('ApiUtilService', () => {
  let service: ApiUtilService;

  beforeEach(async () => {
    const module: TestingModule = await AutoMockingModule.createTestingModule({
      providers: [ApiUtilService],
    }).compile();

    service = module.get<ApiUtilService>(ApiUtilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
