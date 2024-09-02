import { Environment } from '@/constants/app.constant';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { HealthController } from './health.controller';

// Mock classes
const mockConfigService = {
  get: jest.fn(),
};

const mockHealthCheckService = {
  check: jest.fn(),
};

const mockHttpHealthIndicator = {
  pingCheck: jest.fn(),
};

const mockTypeOrmHealthIndicator = {
  pingCheck: jest.fn(),
};

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: ConfigService, useValue: mockConfigService },
        { provide: HealthCheckService, useValue: mockHealthCheckService },
        { provide: HttpHealthIndicator, useValue: mockHttpHealthIndicator },
        {
          provide: TypeOrmHealthIndicator,
          useValue: mockTypeOrmHealthIndicator,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should perform a health check with database and API docs when in development', async () => {
      // Arrange
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'app.nodeEnv') return Environment.DEVELOPMENT;
        if (key === 'app.url') return 'http://localhost';
        return null;
      });
      mockHttpHealthIndicator.pingCheck.mockReturnValue(of({ status: 'ok' }));
      mockTypeOrmHealthIndicator.pingCheck.mockReturnValue(
        of({ status: 'ok' }),
      );
      mockHealthCheckService.check.mockResolvedValue({ status: 'ok' });

      // Act
      const result = await controller.check();

      // Debug output
      console.log(
        'TypeOrmHealthIndicator calls:',
        mockTypeOrmHealthIndicator.pingCheck.mock.calls,
      );
      console.log(
        'HttpHealthIndicator calls:',
        mockHttpHealthIndicator.pingCheck.mock.calls,
      );

      // Assert
      expect(result).toEqual({ status: 'ok' });
    });

    it('should perform a health check with only database when not in development', async () => {
      // Arrange
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'app.nodeEnv') return Environment.PRODUCTION; // Adjust based on your actual environment settings
        return null;
      });
      mockTypeOrmHealthIndicator.pingCheck.mockReturnValue(
        of({ status: 'ok' }),
      );
      mockHealthCheckService.check.mockResolvedValue({ status: 'ok' });

      // Act
      const result = await controller.check();

      // Debug output
      console.log(
        'TypeOrmHealthIndicator calls:',
        mockTypeOrmHealthIndicator.pingCheck.mock.calls,
      );
      console.log(
        'HttpHealthIndicator calls:',
        mockHttpHealthIndicator.pingCheck.mock.calls,
      );

      // Assert
      expect(result).toEqual({ status: 'ok' });
      expect(mockHttpHealthIndicator.pingCheck).not.toHaveBeenCalled();
    });

    it('should handle errors thrown by health check service', async () => {
      // Arrange
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'app.nodeEnv') return Environment.DEVELOPMENT;
        if (key === 'app.url') return 'http://localhost';
        return null;
      });
      mockHttpHealthIndicator.pingCheck.mockReturnValue(of({ status: 'ok' }));
      mockTypeOrmHealthIndicator.pingCheck.mockReturnValue(
        of({ status: 'ok' }),
      );
      mockHealthCheckService.check.mockRejectedValue(
        new Error('Health check failed'),
      );

      // Act & Assert
      await expect(controller.check()).rejects.toThrow('Health check failed');
    });
  });
});
