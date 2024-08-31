import { Test, TestingModule } from '@nestjs/testing';
import { GcpModule } from './gcp.module';

describe('GcpModule', () => {
  let gcpModule: TestingModule;

  beforeAll(async () => {
    gcpModule = await Test.createTestingModule({
      imports: [GcpModule],
    }).compile();
  });

  it('should create GcpModule', () => {
    expect(gcpModule).toBeDefined();
  });
});
