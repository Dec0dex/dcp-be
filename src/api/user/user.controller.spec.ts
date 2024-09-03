import { Test, TestingModule } from '@nestjs/testing';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { UserResDto } from './dto/user.res.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

// Mock UserDto
const mockUserDto: UserResDto = {
  id: 'mockUserId',
  profileTag: 'mockUser',
  isSuspended: false,
  needsEnrollment: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock UserService
const mockUserService = {
  findOneByExternalId: jest.fn().mockReturnValue(mockUserDto),
};

// Mock Session
const mockSession: Partial<SessionContainer> = {
  getUserId: jest.fn().mockReturnValue('mockUserId'),
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should process [GET] /me', async () => {
    const result = await controller.getCurrentUser(mockSession as any);
    expect(mockUserService.findOneByExternalId).toHaveBeenCalledTimes(1);
    expect(mockUserService.findOneByExternalId).toHaveBeenCalledWith(
      mockSession.getUserId(),
    );
    expect(result).toEqual(mockUserDto);
  });
});
