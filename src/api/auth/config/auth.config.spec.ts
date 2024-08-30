import validateConfig from '@/utils/validate-config';
import authConfig, { EnvironmentVariablesValidator } from './auth.config';

describe('Auth Config', () => {
  beforeEach(() => {
    process.env.AUTH_JWT_SECRET = 'jwt_secret';
    process.env.AUTH_JWT_TOKEN_EXPIRES_IN = '1h';
    process.env.AUTH_REFRESH_SECRET = 'refresh_secret';
    process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN = '7d';
    process.env.AUTH_FORGOT_SECRET = 'forgot_secret';
    process.env.AUTH_FORGOT_TOKEN_EXPIRES_IN = '1h';
    process.env.AUTH_CONFIRM_EMAIL_SECRET = 'confirm_email_secret';
    process.env.AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN = '24h';
  });

  it('should return correct auth configuration based on environment variables', () => {
    const config = authConfig();

    expect(config).toEqual({
      secret: 'jwt_secret',
      expires: '1h',
      refreshSecret: 'refresh_secret',
      refreshExpires: '7d',
      forgotSecret: 'forgot_secret',
      forgotExpires: '1h',
      confirmEmailSecret: 'confirm_email_secret',
      confirmEmailExpires: '24h',
    });
  });

  it('should throw validation errors for invalid environment variables', () => {
    process.env.AUTH_JWT_SECRET = ''; // Invalid value
    process.env.AUTH_JWT_TOKEN_EXPIRES_IN = ''; // Invalid value

    expect(() => {
      validateConfig(process.env, EnvironmentVariablesValidator);
    }).toThrowError(); // Check that an error is thrown
  });

  describe('Environment Variables Validation', () => {
    it('should validate AUTH_JWT_SECRET', () => {
      process.env.AUTH_JWT_SECRET = ''; // Invalid value

      expect(() => {
        validateConfig(process.env, EnvironmentVariablesValidator);
      }).toThrowError(); // Should throw an error if AUTH_JWT_SECRET is invalid
    });

    it('should validate AUTH_JWT_TOKEN_EXPIRES_IN', () => {
      process.env.AUTH_JWT_TOKEN_EXPIRES_IN = ''; // Invalid value

      expect(() => {
        validateConfig(process.env, EnvironmentVariablesValidator);
      }).toThrowError(); // Should throw an error if AUTH_JWT_TOKEN_EXPIRES_IN is invalid
    });

    it('should handle optional fields correctly', () => {
      process.env.AUTH_REFRESH_SECRET = ''; // Optional field

      expect(() => {
        validateConfig(process.env, EnvironmentVariablesValidator);
      }).not.toThrowError(); // Should not throw an error for optional fields being empty
    });

    it('should handle missing required fields', () => {
      delete process.env.AUTH_JWT_SECRET; // Required field is missing

      expect(() => {
        validateConfig(process.env, EnvironmentVariablesValidator);
      }).toThrowError(); // Should throw an error if AUTH_JWT_SECRET is missing
    });
  });
});
