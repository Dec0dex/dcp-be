import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ErrorCode } from '../../constants/error-code.constant';
import { ValidationException } from '../../exceptions/validation.exception';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

// Mock User
const mockUser = {
  id: 'mockUserId',
  isSuspended: false,
  firstName: 'Test',
  lastName: 'User',
  toDto: jest.fn().mockReturnThis(),
};

// Mock UserRepository
const mockUserRepository = {
  findOneByOrFail: jest.fn().mockReturnValue(mockUser),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByExternalId', () => {
    it('should find user by external id', async () => {
      const result = await service.findOneByExternalId('someExternalId');
      expect(mockUserRepository.findOneByOrFail).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOneByOrFail).toHaveBeenCalledWith({
        externalId: 'someExternalId',
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw suspended error if user is suspended', async () => {
      mockUser.isSuspended = true;
      try {
        await service.findOneByExternalId('someExternalId');
      } catch (err) {
        expect(err).toBeInstanceOf(ValidationException);
        expect(err.getResponse()).toEqual({ errorCode: ErrorCode.E0001 });
      }
    });
  });
});
