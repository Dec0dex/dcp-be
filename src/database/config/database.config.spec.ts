import validateConfig from '@/utils/validate-config';
import config, { EnvironmentVariablesValidator } from './database.config';

describe('Database Config', () => {
  beforeEach(() => {
    process.env.DATABASE_URL = '';
    process.env.DATABASE_TYPE = 'postgres';
    process.env.DATABASE_HOST = 'localhost';
    process.env.DATABASE_PORT = '5432';
    process.env.DATABASE_PASSWORD = 'password';
    process.env.DATABASE_NAME = 'testdb';
    process.env.DATABASE_USERNAME = 'user';
    process.env.DATABASE_LOGGING = 'false';
    process.env.DATABASE_SYNCHRONIZE = 'true';
    process.env.DATABASE_MAX_CONNECTIONS = '10';
    process.env.DATABASE_SSL_ENABLED = 'false';
    process.env.DATABASE_REJECT_UNAUTHORIZED = 'true';
    process.env.DATABASE_CA = 'ca-cert';
    process.env.DATABASE_KEY = 'key';
    process.env.DATABASE_CERT = 'cert';
  });

  it('should return correct database configuration based on environment variables', () => {
    const configValues = config();

    expect(configValues).toEqual({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'password',
      name: 'testdb',
      username: 'user',
      logging: false,
      synchronize: true,
      maxConnections: 10,
      sslEnabled: false,
      rejectUnauthorized: true,
      ca: 'ca-cert',
      key: 'key',
      cert: 'cert',
    });
  });

  it('should throw validation errors for invalid environment variables', () => {
    process.env.DATABASE_PORT = 'invalid_port'; // Invalid integer value

    expect(() => {
      validateConfig(process.env, EnvironmentVariablesValidator);
    }).toThrowError(); // Check that an error is thrown
  });

  describe('Environment Variables Validation', () => {
    it('should validate DATABASE_URL', () => {
      process.env.DATABASE_URL =
        'postgres://user:password@localhost:5432/testdb';
      process.env.DATABASE_TYPE = '';
      process.env.DATABASE_HOST = '';
      process.env.DATABASE_PORT = '';
      process.env.DATABASE_PASSWORD = '';
      process.env.DATABASE_NAME = '';
      process.env.DATABASE_USERNAME = '';

      expect(() => {
        validateConfig(process.env, EnvironmentVariablesValidator);
      }).not.toThrowError(); // Should not throw an error if DATABASE_URL is present
    });

    it('should validate DATABASE_TYPE if DATABASE_URL is not set', () => {
      process.env.DATABASE_URL = '';
      process.env.DATABASE_TYPE = 'postgres';
      process.env.DATABASE_HOST = 'localhost';
      process.env.DATABASE_PORT = '5432';
      process.env.DATABASE_PASSWORD = 'password';
      process.env.DATABASE_NAME = 'testdb';
      process.env.DATABASE_USERNAME = 'user';

      expect(() => {
        validateConfig(process.env, EnvironmentVariablesValidator);
      }).not.toThrowError(); // Should not throw an error if DATABASE_TYPE is set
    });
  });
});
