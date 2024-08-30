import { Logger } from '@nestjs/common';
import MailerCustomLogger from './mailer-custom-logger';

describe('MailerCustomLogger', () => {
  let mailerLogger: MailerCustomLogger;
  let mockLogger: Logger;

  beforeEach(() => {
    jest.resetModules();

    // Create a new mock instance of Logger before each test
    mockLogger = {
      log: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as unknown as Logger;

    // Initialize MailerCustomLogger with the mockLogger
    jest.spyOn(Logger.prototype, 'log').mockImplementation(mockLogger.log);
    jest.spyOn(Logger.prototype, 'debug').mockImplementation(mockLogger.debug);
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(mockLogger.warn);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(mockLogger.error);

    mailerLogger = MailerCustomLogger.getInstance([
      'trace',
      'debug',
      'info',
      'warn',
      'error',
      'fatal',
    ]);
  });

  it('should create an instance of MailerCustomLogger', () => {
    expect(mailerLogger).toBeInstanceOf(MailerCustomLogger);
  });

  it('should log trace messages when trace level is included', () => {
    mailerLogger.trace(
      { tnx: 'server', sid: '123' },
      'Test trace message',
      'param1',
      'param2',
    );
    expect(mockLogger.log).toHaveBeenCalledWith(
      '[123] S: Test trace message',
      'param1',
      'param2',
    );
  });

  it('should not log trace messages when trace level is not included', () => {
    const mailerLoggerWithoutTrace = MailerCustomLogger.getInstance(['info']);
    mailerLoggerWithoutTrace.trace({ tnx: 'server' }, 'Test trace message');
    expect(mockLogger.log).not.toHaveBeenCalled();
  });

  it('should log debug messages when debug level is included', () => {
    mailerLogger.debug(
      { tnx: 'client', cid: '456' },
      'Test debug message',
      'param1',
    );
    expect(mockLogger.debug).toHaveBeenCalledWith(
      '[#456] C: Test debug message',
      'param1',
    );
  });

  it('should not log debug messages when debug level is not included', () => {
    const mailerLoggerWithoutDebug = MailerCustomLogger.getInstance(['info']);
    mailerLoggerWithoutDebug.debug({ tnx: 'client' }, 'Test debug message');
    expect(mockLogger.debug).not.toHaveBeenCalled();
  });

  it('should log info messages when info level is included', () => {
    mailerLogger.info({ tnx: 'server' }, 'Test info message');
    expect(mockLogger.log).toHaveBeenCalledWith('S: Test info message');
  });

  it('should not log info messages when info level is not included', () => {
    const mailerLoggerWithoutInfo = MailerCustomLogger.getInstance(['error']);
    mailerLoggerWithoutInfo.info({}, 'Test info message');
    expect(mockLogger.log).not.toHaveBeenCalled();
  });

  it('should log warn messages when warn level is included', () => {
    mailerLogger.warn({}, 'Test warn message');
    expect(mockLogger.warn).toHaveBeenCalledWith('Test warn message');
  });

  it('should not log warn messages when warn level is not included', () => {
    const mailerLoggerWithoutWarn = MailerCustomLogger.getInstance(['info']);
    mailerLoggerWithoutWarn.warn({}, 'Test warn message');
    expect(mockLogger.warn).not.toHaveBeenCalled();
  });

  it('should log error messages when error level is included', () => {
    mailerLogger.error({}, 'Test error message');
    expect(mockLogger.error).toHaveBeenCalledWith('Test error message');
  });

  it('should not log error messages when error level is not included', () => {
    const mailerLoggerWithoutError = MailerCustomLogger.getInstance(['info']);
    mailerLoggerWithoutError.error({}, 'Test error message');
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('should log fatal messages when fatal level is included', () => {
    mailerLogger.fatal({}, 'Test fatal message');
    expect(mockLogger.error).toHaveBeenCalledWith('Test fatal message');
  });

  it('should not log fatal messages when fatal level is not included', () => {
    const mailerLoggerWithoutFatal = MailerCustomLogger.getInstance(['info']);
    mailerLoggerWithoutFatal.fatal({}, 'Test fatal message');
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('should not log messages for levels not included', () => {
    const mailerLoggerWithoutLevels = MailerCustomLogger.getInstance([]);
    mailerLoggerWithoutLevels.trace({}, 'Test trace message');
    mailerLoggerWithoutLevels.debug({}, 'Test debug message');
    mailerLoggerWithoutLevels.info({}, 'Test info message');
    mailerLoggerWithoutLevels.warn({}, 'Test warn message');
    mailerLoggerWithoutLevels.error({}, 'Test error message');
    mailerLoggerWithoutLevels.fatal({}, 'Test fatal message');

    expect(mockLogger.log).not.toHaveBeenCalled();
    expect(mockLogger.debug).not.toHaveBeenCalled();
    expect(mockLogger.warn).not.toHaveBeenCalled();
    expect(mockLogger.error).not.toHaveBeenCalled();
  });
});
