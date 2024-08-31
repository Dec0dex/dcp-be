import { ErrorCode } from '@/constants/error-code.constant';
import { ValidationException } from './validation.exception';

describe('ValidationException', () => {
  it('should create a ValidationException with the default error code and no message', () => {
    const exception = new ValidationException();
    expect(exception.getResponse()).toEqual({
      errorCode: ErrorCode.V0000,
      message: undefined,
    });
    expect(exception.getStatus()).toBe(400); // BadRequestException returns 400 status
  });

  it('should create a ValidationException with a custom error code and no message', () => {
    const exception = new ValidationException(ErrorCode.V0000);
    expect(exception.getResponse()).toEqual({
      errorCode: ErrorCode.V0000,
      message: undefined,
    });
    expect(exception.getStatus()).toBe(400);
  });

  it('should create a ValidationException with a custom error code and a custom message', () => {
    const exception = new ValidationException(
      ErrorCode.V0001,
      'Custom validation error',
    );
    expect(exception.getResponse()).toEqual({
      errorCode: ErrorCode.V0001,
      message: 'Custom validation error',
    });
    expect(exception.getStatus()).toBe(400);
  });

  it('should create a ValidationException with the default error code and a custom message', () => {
    const exception = new ValidationException(
      undefined,
      'Another custom error',
    );
    expect(exception.getResponse()).toEqual({
      errorCode: ErrorCode.V0000,
      message: 'Another custom error',
    });
    expect(exception.getStatus()).toBe(400);
  });
});
