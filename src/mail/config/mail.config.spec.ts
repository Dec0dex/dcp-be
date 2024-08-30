import validateConfig from '../../utils/validate-config';
import mailConfig, { EnvironmentVariablesValidator } from './mail.config'; // Adjust import based on your actual file structure

describe('Mail Config', () => {
  beforeEach(() => {
    process.env.MAIL_HOST = 'smtp.mailtrap.io';
    process.env.MAIL_PORT = '587';
    process.env.MAIL_USER = 'user';
    process.env.MAIL_PASSWORD = 'password';
    process.env.MAIL_IGNORE_TLS = 'false';
    process.env.MAIL_SECURE = 'false';
    process.env.MAIL_REQUIRE_TLS = 'true';
    process.env.MAIL_DEFAULT_EMAIL = 'test@example.com';
    process.env.MAIL_DEFAULT_NAME = 'Test Sender';
  });

  it('should return correct mail configuration based on environment variables', () => {
    const config = mailConfig();

    expect(config).toEqual({
      host: 'smtp.mailtrap.io',
      port: 587,
      user: 'user',
      password: 'password',
      ignoreTLS: false,
      secure: false,
      requireTLS: true,
      defaultEmail: 'test@example.com',
      defaultName: 'Test Sender',
    });
  });

  it('should throw validation errors for invalid environment variables', () => {
    process.env.MAIL_PORT = 'invalid_port'; // Invalid integer value
    process.env.MAIL_DEFAULT_EMAIL = 'invalid_email'; // Invalid email value

    expect(() => {
      validateConfig(process.env, EnvironmentVariablesValidator);
    }).toThrowError(); // Check that an error is thrown
  });

  describe('Environment Variables Validation', () => {
    it('should validate MAIL_PORT', () => {
      process.env.MAIL_PORT = 'invalid_port'; // Invalid integer value

      expect(() => {
        validateConfig(process.env, EnvironmentVariablesValidator);
      }).toThrowError(); // Should throw an error if MAIL_PORT is invalid
    });

    it('should validate MAIL_DEFAULT_EMAIL', () => {
      process.env.MAIL_DEFAULT_EMAIL = 'invalid_email'; // Invalid email value

      expect(() => {
        validateConfig(process.env, EnvironmentVariablesValidator);
      }).toThrowError(); // Should throw an error if MAIL_DEFAULT_EMAIL is invalid
    });

    it('should validate optional fields correctly', () => {
      process.env.MAIL_USER = '';
      process.env.MAIL_PASSWORD = '';

      expect(() => {
        validateConfig(process.env, EnvironmentVariablesValidator);
      }).not.toThrowError(); // Should not throw an error if optional fields are empty
    });

    it('should handle missing required fields', () => {
      delete process.env.MAIL_HOST; // Required field is missing

      expect(() => {
        validateConfig(process.env, EnvironmentVariablesValidator);
      }).toThrowError(); // Should throw an error if MAIL_HOST is missing
    });
  });
});
