import { Test } from '@nestjs/testing';
import { SharedModule } from './shared.module';

describe('SharedModule', () => {
  let module: SharedModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [],
    }).compile();
  });

  it('should create ShareModule', () => {
    expect(module).toBeDefined();
  });
});
