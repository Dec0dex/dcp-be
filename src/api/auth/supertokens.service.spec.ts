import { Test, TestingModule } from '@nestjs/testing';
import supertokens from 'supertokens-node';
import Session, { SessionContainer } from 'supertokens-node/recipe/session';
import UserRoles, {
  PermissionClaim,
  UserRoleClaim,
} from 'supertokens-node/recipe/userroles';
import { UserService } from '../user/user.service';
import { AuthConfig, ConfigInjectionToken } from './config/auth-config.type';
import {
  SupertokensService,
  addRoleToUser,
  addRolesAndPermissionsToSession,
  createLocalUser,
  hasUserWithExternalId,
} from './supertokens.service';

// Mock supertokens-node
jest.mock('supertokens-node', () => ({
  init: jest.fn(),
}));

jest.mock('supertokens-node/recipe/userroles', () => ({
  addRoleToUser: jest.fn(),
  init: jest.fn(),
}));

jest.mock('supertokens-node/recipe/session', () => ({
  fetchAndSetClaim: jest.fn(),
  init: jest.fn(),
}));

// Mock user.service
const mockUserService = {
  // Define mock methods and properties
  findOneByExternalId: jest.fn(),
  create: jest.fn(),
};

describe('SupertokensService', () => {
  let service: SupertokensService;
  let mockInit: jest.Mock;
  let mockAddRoleToUser: jest.Mock;
  let mockFetchAndSetClaim: jest.Mock;

  beforeEach(async () => {
    // Initialize mock function
    mockInit = jest.fn();
    (supertokens.init as jest.Mock) = mockInit;

    mockAddRoleToUser = jest.fn();
    (UserRoles.addRoleToUser as jest.Mock) = mockAddRoleToUser;

    mockFetchAndSetClaim = jest.fn();
    (Session.fetchAndSetClaim as jest.Mock) = mockFetchAndSetClaim;

    // Set up the module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupertokensService,
        {
          provide: ConfigInjectionToken,
          useValue: {
            appInfo: {
              appName: 'TestApp',
              apiDomain: 'http://localhost',
              websiteDomain: 'http://localhost',
            },
            connectionURI: 'http://localhost:9000',
            apiKey: 'test-api-key',
            social: {
              google: {
                clientId: 'google-client-id',
                clientSecret: 'google-client-secret',
              },
              github: {
                clientId: 'github-client-id',
                clientSecret: 'github-client-secret',
              },
              apple: {
                clientId: 'apple-client-id',
                privateKey: 'apple-private-key',
                keyId: 'apple-key-id',
                teamId: 'apple-team-id',
              },
              facebook: {
                clientId: 'facebook-client-id',
                clientSecret: 'facebook-client-secret',
              },
            },
            adminUser: '',
          },
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<SupertokensService>(SupertokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize supertokens correctly', () => {
    // Define the expected configuration object
    const config: AuthConfig = {
      appInfo: {
        appName: 'TestApp',
        apiDomain: 'http://localhost',
        websiteDomain: 'http://localhost',
      },
      connectionURI: 'http://localhost:9000',
      apiKey: 'test-api-key',
      social: {
        google: {
          clientId: 'google-client-id',
          clientSecret: 'google-client-secret',
        },
        github: {
          clientId: 'github-client-id',
          clientSecret: 'github-client-secret',
        },
        apple: {
          clientId: 'apple-client-id',
          privateKey: 'apple-private-key',
          keyId: 'apple-key-id',
          teamId: 'apple-team-id',
        },
        facebook: {
          clientId: 'facebook-client-id',
          clientSecret: 'facebook-client-secret',
        },
      },
      adminUser: '',
    };

    // Verify that supertokens.init was called with the expected configuration
    expect(supertokens.init).toHaveBeenCalledWith(
      expect.objectContaining({
        appInfo: config.appInfo,
        supertokens: {
          connectionURI: config.connectionURI,
          apiKey: config.apiKey,
        },
        recipeList: expect.arrayContaining([
          expect.any(Function), // EmailPassword.init()
          expect.any(Function), // ThirdParty.init()
          expect.any(Function), // AccountLinking.init()
          expect.any(Function), // Session.init()
          expect.any(Function), // UserRoles.init()
          expect.any(Function), // Dashboard.init()
        ]),
      }),
    );
  });

  describe('addRoleToUser', () => {
    it('should add role to user correctly', async () => {
      mockAddRoleToUser.mockResolvedValue({
        status: 'SUCCESS',
        didUserAlreadyHaveRole: false,
      });

      await addRoleToUser('userId');

      expect(UserRoles.addRoleToUser).toHaveBeenCalledWith(
        'public',
        'userId',
        'user',
      );
      expect(UserRoles.addRoleToUser).toHaveBeenCalledTimes(1);
    });

    it('should handle UNKNOWN_ROLE_ERROR correctly', async () => {
      mockAddRoleToUser.mockResolvedValue({ status: 'UNKNOWN_ROLE_ERROR' });

      await addRoleToUser('userId');

      expect(UserRoles.addRoleToUser).toHaveBeenCalledWith(
        'public',
        'userId',
        'user',
      );
      expect(UserRoles.addRoleToUser).toHaveBeenCalledTimes(1);
    });

    it('should handle didUserAlreadyHaveRole = true correctly', async () => {
      mockAddRoleToUser.mockResolvedValue({
        status: 'SUCCESS',
        didUserAlreadyHaveRole: true,
      });

      await addRoleToUser('userId');

      expect(UserRoles.addRoleToUser).toHaveBeenCalledWith(
        'public',
        'userId',
        'user',
      );
      expect(UserRoles.addRoleToUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('addRolesAndPermissionsToClaims', () => {
    it('should add roles and permissions to session correctly', async () => {
      const mockSession: Partial<SessionContainer> = {
        fetchAndSetClaim: mockFetchAndSetClaim
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined),
      };

      await addRolesAndPermissionsToSession(mockSession as SessionContainer);

      expect(mockSession.fetchAndSetClaim).toHaveBeenCalledWith(UserRoleClaim);
      expect(mockSession.fetchAndSetClaim).toHaveBeenCalledWith(
        PermissionClaim,
      );
      expect(mockSession.fetchAndSetClaim).toHaveBeenCalledTimes(2);
    });

    it('should handle session being undefined', async () => {
      const mockSession: Partial<SessionContainer> = {
        fetchAndSetClaim: mockFetchAndSetClaim.mockResolvedValueOnce(undefined),
      };

      await addRolesAndPermissionsToSession(undefined as any);

      expect(mockSession.fetchAndSetClaim).not.toHaveBeenCalled();
    });
  });

  describe('createLocalUser', () => {
    it('should not create local user', async () => {
      mockUserService.findOneByExternalId.mockResolvedValue({});
      await createLocalUser(
        { id: 'someUserId', emails: [], phoneNumbers: [] },
        mockUserService as any,
      );

      expect(mockUserService.create).not.toHaveBeenCalled();
    });

    it('should create local user', async () => {
      mockUserService.findOneByExternalId.mockRejectedValue({});
      const userToCreate = { id: 'someUserId', emails: [], phoneNumbers: [] };
      await createLocalUser(userToCreate, mockUserService as any);

      expect(mockUserService.create).toHaveBeenCalledWith(userToCreate);
    });
  });

  describe('hasUserWithExternalId', () => {
    it('should return true', async () => {
      mockUserService.findOneByExternalId.mockResolvedValue({});
      const result = await hasUserWithExternalId(
        'someUserId',
        mockUserService as any,
      );

      expect(mockUserService.findOneByExternalId).toHaveBeenCalledWith(
        'someUserId',
      );
      expect(result).toBe(true);
    });

    it('should return false', async () => {
      mockUserService.findOneByExternalId.mockRejectedValue({});
      const result = await hasUserWithExternalId(
        'someUserId',
        mockUserService as any,
      );

      expect(mockUserService.findOneByExternalId).toHaveBeenCalledWith(
        'someUserId',
      );
      expect(result).toBe(false);
    });
  });
});
