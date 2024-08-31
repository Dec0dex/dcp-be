import { Test, TestingModule } from '@nestjs/testing';
import { AwsModule } from './aws/aws.module';
import { GcpModule } from './gcp/gcp.module';
import { LibsModule } from './libs.module';

describe('LibsModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [LibsModule],
    }).compile();
  });

  it('should be defined', () => {
    const libsModule = module.get(LibsModule);
    expect(libsModule).toBeDefined();
  });

  it('should import AwsModule', () => {
    const awsModule = module.get(AwsModule);
    expect(awsModule).toBeDefined();
  });

  it('should import GcpModule', () => {
    const gcpModule = module.get(GcpModule);
    expect(gcpModule).toBeDefined();
  });
});
