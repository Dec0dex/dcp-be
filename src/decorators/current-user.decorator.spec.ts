import { Controller, Get } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrentUser } from './current-user.decorator'; // Adjust the import path

// Example User data
const user = { id: '123', name: 'John Doe' };

// Mocking the ExecutionContext
const mockExecutionContext = (userData: any = user) => ({
  switchToHttp: () => ({
    getRequest: () => ({
      user: userData, // Mock user object in the request
    }),
  }),
});

describe('CurrentUser Decorator', () => {
  // Mock controller for testing decorator
  @Controller('users')
  class UsersController {
    @Get('profile')
    getProfile(@CurrentUser() user: any) {
      return user;
    }
  }

  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should return the entire user object if no data is provided', () => {
    const ctx = mockExecutionContext();
    const request = ctx.switchToHttp().getRequest();
    const result = controller.getProfile(request);
    expect(result).toEqual({ user: user });
  });

  it('should return the specific user property if data is provided', () => {
    const ctx = mockExecutionContext({ name: 'John Doe' });
    const request = ctx.switchToHttp().getRequest();
    const result = controller.getProfile(request);
    expect(result).toEqual({ user: { name: 'John Doe' } });
  });

  it('should return undefined if user is not set in the request', () => {
    const ctx = mockExecutionContext(null); // No user data
    const request = ctx.switchToHttp().getRequest();
    const result = controller.getProfile(request);
    expect(result).toEqual({ user: null });
  });
});
