import { LogService } from '@/constants/app.constant';
import { ConfigService } from '@nestjs/config';
import loggerFactory, { genReqId as genReq } from './logger-factory';

jest.mock('@nestjs/config');
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid'),
}));

describe('loggerFactory', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = {
      get: jest.fn(),
    } as unknown as ConfigService;
  });

  it('should return default console logging configuration when logService is CONSOLE', async () => {
    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      if (key === 'app.logLevel') return 'info';
      if (key === 'app.logService') return LogService.CONSOLE;
      if (key === 'app.debug') return false;
    });

    const result = await loggerFactory(configService);

    expect(result).toEqual({
      pinoHttp: {
        level: 'info',
        customSuccessMessage: expect.any(Function),
        customReceivedMessage: expect.any(Function),
        customErrorMessage: expect.any(Function),
        redact: {
          paths: expect.any(Array),
          censor: '**GDPR COMPLIANT**',
        },
        messageKey: 'msg',
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            ignore:
              'req.id,req.method,req.url,req.headers,req.remoteAddress,req.remotePort,res.headers',
          },
        },
      },
    });
  });

  it('should return Google Logging configuration when logService is GOOGLE_LOGGING', async () => {
    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      if (key === 'app.logLevel') return 'info';
      if (key === 'app.logService') return LogService.GOOGLE_LOGGING;
      if (key === 'app.debug') return false;
    });

    const result = await loggerFactory(configService);

    expect(result).toEqual({
      pinoHttp: {
        level: 'info',
        customSuccessMessage: expect.any(Function),
        customReceivedMessage: expect.any(Function),
        customErrorMessage: expect.any(Function),
        redact: {
          paths: expect.any(Array),
          censor: '**GDPR COMPLIANT**',
        },
        messageKey: 'message',
        formatters: {
          level: expect.any(Function),
        },
      },
    });
  });

  it('should return configuration with genReqId if debug is enabled', async () => {
    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      if (key === 'app.logLevel') return 'info';
      if (key === 'app.logService') return LogService.CONSOLE;
      if (key === 'app.debug') return true;
    });

    const result = await loggerFactory(configService);

    expect(result).toEqual({
      pinoHttp: {
        level: 'info',
        genReqId: expect.any(Function),
        serializers: {
          req: expect.any(Function),
        },
        customSuccessMessage: expect.any(Function),
        customReceivedMessage: expect.any(Function),
        customErrorMessage: expect.any(Function),
        redact: {
          paths: expect.any(Array),
          censor: '**GDPR COMPLIANT**',
        },
        messageKey: 'msg',
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            ignore:
              'req.id,req.method,req.url,req.headers,req.remoteAddress,req.remotePort,res.headers',
          },
        },
      },
    });
  });

  it('should set X-Request-Id header and return the ID in genReqId', () => {
    const mockReq = { headers: {}, method: 'GET', url: '/test' } as any;
    const mockRes = { setHeader: jest.fn() } as any;

    const id = genReq(mockReq, mockRes);

    expect(id).toBe('test-uuid');
    expect(mockRes.setHeader).toHaveBeenCalledWith('X-Request-Id', 'test-uuid');
  });
});
