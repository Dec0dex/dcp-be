import {
  ClassSerializerInterceptor,
  Logger,
  RequestMethod,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { AuthGuard } from './guards/auth.guard';
import setupSwagger from './utils/setup-swagger';

// Mock dependencies
jest.mock('compression');
jest.mock('helmet');
jest.mock('./utils/setup-swagger', () => jest.fn());
jest.mock('./app.module', () => ({
  AppModule: {
    imports: [],
    providers: [],
    controllers: [],
    exports: [],
  },
}));

const configService = {
  getOrThrow: jest.fn((key) => {
    switch (key) {
      case 'app.nodeEnv':
        return 'development';
      case 'app.corsOrigin':
        return 'http://localhost';
      case 'app.apiPrefix':
        return 'api';
      case 'app.port':
        return 3000;
      default:
        return null;
    }
  }),
};

jest.mock('@nestjs/core', () => ({
  ...jest.requireActual('@nestjs/core'),
  NestFactory: {
    create: jest.fn().mockResolvedValue({
      useLogger: jest.fn(),
      use: jest.fn(),
      get: jest.fn().mockImplementation((token) => {
        if (token === ConfigService) {
          return configService;
        }
        return new Logger('TypeORM[default]'); // Return an empty object for other tokens
      }),
      enableCors: jest.fn(),
      setGlobalPrefix: jest.fn(),
      enableVersioning: jest.fn(),
      useGlobalGuards: jest.fn(),
      useGlobalFilters: jest.fn(),
      useGlobalPipes: jest.fn(),
      useGlobalInterceptors: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
      getUrl: jest.fn().mockResolvedValue('http://localhost:3000'),
      close: jest.fn(),
    }),
  },
}));

describe('Bootstrap', () => {
  let app: any;

  it('should setup the app correctly', async () => {
    // Dynamically import the bootstrap function
    const mainModule = await import('./main');
    const bootstrap = mainModule.bootstrap;

    // Call the bootstrap function
    app = await bootstrap();

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule, {
      bufferLogs: true,
    });
    expect(app.useLogger).toHaveBeenCalledWith(expect.any(Logger));
    expect(app.use).toHaveBeenCalledWith(helmet());
    expect(app.use).toHaveBeenCalledWith(compression());
    expect(app.enableCors).toHaveBeenCalled();
    expect(app.setGlobalPrefix).toHaveBeenCalledWith('api', {
      exclude: [{ method: RequestMethod.GET, path: 'health' }],
    });
    expect(app.enableVersioning).toHaveBeenCalledWith({
      type: VersioningType.URI,
    });
    expect(app.useGlobalGuards).toHaveBeenCalledWith(expect.any(AuthGuard));
    expect(app.useGlobalFilters).toHaveBeenCalledWith(
      expect.any(GlobalExceptionFilter),
    );
    expect(app.useGlobalPipes).toHaveBeenCalledWith(expect.any(ValidationPipe));
    expect(app.useGlobalInterceptors).toHaveBeenCalledWith(
      expect.any(ClassSerializerInterceptor),
    );
    expect(setupSwagger).toHaveBeenCalled();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
