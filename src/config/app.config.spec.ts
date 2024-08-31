import { Environment, LogService } from '@/constants/app.constant';
import validateConfig from '../utils/validate-config';
import appConfig, {
  EnvironmentVariablesValidator,
  getCorsOrigin,
} from './app.config';

describe('App Config', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'test';
    process.env.APP_NAME = 'TestApp';
    process.env.APP_URL = 'http://testapp.com';
    process.env.APP_PORT = '8080';
    process.env.APP_DEBUG = 'true';
    process.env.API_PREFIX = 'api';
    process.env.APP_FALLBACK_LANGUAGE = 'en';
    process.env.APP_LOG_LEVEL = 'info';
    process.env.APP_LOG_SERVICE = LogService.CONSOLE;
    process.env.APP_CORS_ORIGIN = 'true';
  });

  it('should return correct app configuration based on environment variables', () => {
    const config = appConfig();

    expect(config).toEqual({
      nodeEnv: Environment.TEST,
      name: 'TestApp',
      url: 'http://testapp.com',
      port: 8080,
      debug: true,
      apiPrefix: 'api',
      fallbackLanguage: 'en',
      logLevel: 'info',
      logService: LogService.CONSOLE,
      corsOrigin: true,
    });
  });

  it('should throw validation errors for invalid environment variables', () => {
    process.env.NODE_ENV = 'invalid_env'; // Invalid enum value
    process.env.APP_PORT = 'invalid_port'; // Invalid integer value

    expect(() => {
      validateConfig(process.env, EnvironmentVariablesValidator);
    }).toThrowError(); // Check that an error is thrown
  });

  describe('getCorsOrigin', () => {
    it('should return true for "true" string', () => {
      process.env.APP_CORS_ORIGIN = 'true';
      expect(getCorsOrigin()).toBe(true);
    });

    it('should return array of cors for string separated by comma', () => {
      process.env.APP_CORS_ORIGIN = 'test1,test2';
      expect(getCorsOrigin()).toEqual(['test1', 'test2']);
    });

    it('should return "*" for "*" string', () => {
      process.env.APP_CORS_ORIGIN = '*';
      expect(getCorsOrigin()).toBe('*');
    });

    it('should return an array of origins for comma-separated values', () => {
      process.env.APP_CORS_ORIGIN = 'http://localhost:3000,http://example.com';
      expect(getCorsOrigin()).toEqual([
        'http://localhost:3000',
        'http://example.com',
      ]);
    });

    it('should return false for undefined or invalid values', () => {
      process.env.APP_CORS_ORIGIN = 'invalid_value';
      expect(getCorsOrigin()).toBe(false);
    });
  });
});
