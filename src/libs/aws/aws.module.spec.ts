import { Test, TestingModule } from '@nestjs/testing';
import { AwsModule } from './aws.module'; // Replace with the correct path

describe('AwsModule', () => {
  let awsModule: TestingModule;

  beforeAll(async () => {
    awsModule = await Test.createTestingModule({
      imports: [AwsModule],
    }).compile();
  });

  it('should create AwsModule', () => {
    expect(awsModule).toBeDefined();
  });
});
