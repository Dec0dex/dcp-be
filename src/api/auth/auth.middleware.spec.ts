import { Test, TestingModule } from '@nestjs/testing';
import { middleware } from 'supertokens-node/framework/express';
import { AuthMiddleware } from './auth.middleware';

jest.mock('supertokens-node/framework/express', () => ({
  middleware: jest.fn(),
}));

describe('AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware;
  let mockSupertokensMiddleware: jest.Mock;

  beforeEach(async () => {
    // Initialize the mock function
    mockSupertokensMiddleware = jest.fn((req, res, next) => next());

    // Set up the module
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthMiddleware],
    }).compile();

    authMiddleware = module.get<AuthMiddleware>(AuthMiddleware);

    // Configure the mock return value
    (middleware as jest.Mock).mockReturnValue(mockSupertokensMiddleware);
  });

  it('should be defined', () => {
    expect(authMiddleware).toBeDefined();
  });
});
