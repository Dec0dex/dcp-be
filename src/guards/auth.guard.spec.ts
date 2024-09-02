import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getSession } from 'supertokens-node/recipe/session';
import { AuthGuard } from './auth.guard';

jest.mock('supertokens-node/recipe/session', () => ({
  getSession: jest.fn(),
}));

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should allow access if IS_PUBLIC is true', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(true);

    const mockExecutionContext = createMockExecutionContext();

    const result = await guard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
    expect(getSession).not.toHaveBeenCalled();
  });

  it('should retrieve session with sessionRequired: false if IS_AUTH_OPTIONAL is true', async () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValueOnce(false) // IS_PUBLIC
      .mockReturnValueOnce(true); // IS_AUTH_OPTIONAL

    const mockExecutionContext = createMockExecutionContext();
    const req = mockExecutionContext.switchToHttp().getRequest();
    const resp = mockExecutionContext.switchToHttp().getResponse();

    await guard.canActivate(mockExecutionContext);

    expect(getSession).toHaveBeenCalledWith(req, resp, {
      sessionRequired: false,
    });
  });

  it('should retrieve session with sessionRequired: true if neither IS_PUBLIC nor IS_AUTH_OPTIONAL is set', async () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValueOnce(false) // IS_PUBLIC
      .mockReturnValueOnce(false); // IS_AUTH_OPTIONAL

    const mockExecutionContext = createMockExecutionContext();
    const req = mockExecutionContext.switchToHttp().getRequest();
    const resp = mockExecutionContext.switchToHttp().getResponse();

    await guard.canActivate(mockExecutionContext);

    expect(getSession).toHaveBeenCalledWith(req, resp, {
      sessionRequired: true,
    });
  });
});

function createMockExecutionContext(): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: jest.fn().mockReturnValue({}),
      getResponse: jest.fn().mockReturnValue({}),
    }),
    getClass: jest.fn(),
    getHandler: jest.fn(),
  } as unknown as ExecutionContext;
}
