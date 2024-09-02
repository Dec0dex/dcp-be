import { ArgumentsHost } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Error as STError } from 'supertokens-node';
import { SupertokensExceptionFilter } from './auth.filter';

jest.mock('supertokens-node/framework/express', () => ({
  errorHandler: jest.fn().mockReturnValue(jest.fn()), // Return a mock function as the handler
}));

describe('SupertokensExceptionFilter', () => {
  let filter: SupertokensExceptionFilter;

  beforeEach(() => {
    filter = new SupertokensExceptionFilter();
  });

  it('should instantiate handler in constructor', () => {
    expect(filter.handler).toBeDefined();
    expect(typeof filter.handler).toBe('function');
  });

  it('should call supertokens error handler with the correct arguments', () => {
    const mockRequest = {} as Request;
    const mockResponse = {} as Response;
    const mockNext = jest.fn() as unknown as NextFunction;

    const mockArgumentsHost = createMockArgumentsHost(
      mockRequest,
      mockResponse,
      mockNext,
    );

    const mockError = new STError({
      message: 'Test Error',
      type: 'BAD_INPUT_ERROR',
    });

    filter.catch(mockError, mockArgumentsHost);

    expect(filter.handler).toHaveBeenCalledWith(
      mockError,
      mockRequest,
      mockResponse,
      mockNext,
    );
  });
});

function createMockArgumentsHost(
  req: Request,
  res: Response,
  next: NextFunction,
): ArgumentsHost {
  return {
    switchToHttp: () => ({
      getRequest: () => req,
      getResponse: () => res,
      getNext: () => next,
    }),
    getType: jest.fn(),
  } as unknown as ArgumentsHost;
}
