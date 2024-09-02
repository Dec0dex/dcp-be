import { Test, TestingModule } from '@nestjs/testing';
import supertokens from 'supertokens-node';
import { AuthConfig, ConfigInjectionToken } from './config/auth-config.type';
import { SupertokensService } from './supertokens.service';

// Mock supertokens-node
jest.mock('supertokens-node', () => ({
  init: jest.fn(),
}));

describe('SupertokensService', () => {
  let service: SupertokensService;
  let mockInit: jest.Mock;

  beforeEach(async () => {
    // Initialize mock function
    mockInit = jest.fn();
    (supertokens.init as jest.Mock) = mockInit;

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
        debug: true,
        appInfo: config.appInfo,
        supertokens: {
          connectionURI: config.connectionURI,
          apiKey: config.apiKey,
        },
        recipeList: expect.arrayContaining([
          expect.any(Function), // EmailPassword.init()
          expect.any(Function), // ThirdParty.init()
          expect.any(Function), // Session.init()
          expect.any(Function), // UserRoles.init()
          expect.any(Function), // Dashboard.init()
        ]),
      }),
    );
  });
});
