import validateConfig from '@/utils/validate-config';
import authConfig, { EnvironmentVariablesValidator } from './auth.config';

describe('Auth Config', () => {
  beforeEach(() => {
    process.env.AUTH_CONNECTION_URL = 'http://auth.connection.url';
    process.env.AUTH_KEY = 'auth_key';
    process.env.AUTH_GOOGLE_CLIENT_ID = 'google_client_id';
    process.env.AUTH_GOOGLE_CLIENT_SECRET = 'google_client_secret';
    process.env.AUTH_FACEBOOK_CLIENT_ID = 'facebook_client_id';
    process.env.AUTH_FACEBOOK_CLIENT_SECRET = 'facebook_client_secret';
    process.env.AUTH_GITHUB_CLIENT_ID = 'github_client_id';
    process.env.AUTH_GITHUB_CLIENT_SECRET = 'github_client_secret';
    process.env.AUTH_APPLE_CLIENT_ID = 'apple_client_id';
    process.env.AUTH_APPLE_KEY_ID = 'apple_key_id';
    process.env.AUTH_APPLE_PRIVATE_KEY = 'apple_private_key';
    process.env.AUTH_APPLE_TEAM_ID = 'apple_team_id';
    process.env.AUTH_ADMIN_USER = 'admin@decodex.net';
    process.env.APP_NAME = 'TestApp';
    process.env.APP_URL = 'http://testapp.com';
    process.env.APP_WEB_URL = 'http://web.testapp.com';
    process.env.API_PREFIX = 'api';
  });

  it('should return correct auth configuration based on environment variables', () => {
    const config = authConfig();

    expect(config).toEqual({
      appInfo: {
        appName: 'TestApp',
        apiDomain: 'http://testapp.com',
        websiteDomain: 'http://web.testapp.com',
        apiBasePath: 'api/auth',
        websiteBasePath: '/auth',
      },
      social: {
        google: {
          clientId: 'google_client_id',
          clientSecret: 'google_client_secret',
        },
        github: {
          clientId: 'github_client_id',
          clientSecret: 'github_client_secret',
        },
        facebook: {
          clientId: 'facebook_client_id',
          clientSecret: 'facebook_client_secret',
        },
        apple: {
          clientId: 'apple_client_id',
          keyId: 'apple_key_id',
          privateKey: 'apple_private_key',
          teamId: 'apple_team_id',
        },
      },
      connectionURI: 'http://auth.connection.url',
      apiKey: 'auth_key',
      adminUser: 'admin@decodex.net',
    });
  });

  describe('EnvironmentVariablesValidator', () => {
    it('should validate valid environment variables', () => {
      expect(() => {
        validateConfig(process.env, EnvironmentVariablesValidator);
      }).not.toThrowError();
    });
    it('should throw validation errors for invalid environment variables', () => {
      process.env.AUTH_CONNECTION_URL = '';
      process.env.AUTH_KEY = ''; // Both should be non-empty strings

      expect(() => {
        validateConfig(process.env, EnvironmentVariablesValidator);
      }).toThrowError(); // Check that an error is thrown for invalid values
    });

    it('should allow optional environment variables to be undefined or empty', () => {
      process.env.AUTH_GOOGLE_CLIENT_ID = 'google_client_id';
      process.env.AUTH_GOOGLE_CLIENT_SECRET = 'google_client_secret';
      process.env.AUTH_FACEBOOK_CLIENT_ID = '';
      process.env.AUTH_FACEBOOK_CLIENT_SECRET = undefined;
      process.env.AUTH_GITHUB_CLIENT_ID = '';
      process.env.AUTH_GITHUB_CLIENT_SECRET = undefined;
      process.env.AUTH_APPLE_CLIENT_ID = '';
      process.env.AUTH_APPLE_KEY_ID = undefined;
      process.env.AUTH_APPLE_PRIVATE_KEY = '';
      process.env.AUTH_APPLE_TEAM_ID = undefined;
      process.env.AUTH_ADMIN_USER = '';

      expect(() => {
        validateConfig(process.env, EnvironmentVariablesValidator);
      }).not.toThrowError();
    });
  });
});
