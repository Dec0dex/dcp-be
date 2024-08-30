import { IS_AUTH_OPTIONAL } from '@/constants/app.constant';
import { Reflector } from '@nestjs/core';
import { AuthOptional } from './auth-optional.decorator';

describe('AuthOptional Decorator', () => {
  it('should set IS_AUTH_OPTIONAL metadata to true', () => {
    // Mock Reflector to access metadata
    const reflector = new Reflector();

    // Create a dummy class with the decorator
    @AuthOptional()
    class TestClass {}

    // Create an instance of Reflector
    const metadata = reflector.get(IS_AUTH_OPTIONAL, TestClass);

    // Assertions
    expect(metadata).toBe(true);
  });
});
