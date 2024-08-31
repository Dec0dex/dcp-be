import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { ConfigService } from '@nestjs/config';
import { HealthCheckService, HttpHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { Environment } from '@/constants/app.constant';
import { AllConfigType } from '@/config/config.type';
import { of, throwError } from 'rxjs';

// Mocking the dependencies
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
        { provide: TypeOrmHealthIndicator, useValue: mockTypeOrmHealthIndicator },
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
      mockConfigService.get = jest.fn()
        .mockReturnValue(Environment.DEVELOPMENT)
        .mockReturnValue('devdevelopment');
      mockHttpHealthIndicator.pingCheck = jest.fn().mockReturnValue(of({ status: 'ok' }));
      mockTypeOrmHealthIndicator.pingCheck = jest.fn().mockReturnValue(of({ status: 'ok' }));
      mockHealthCheckService.check = jest.fn().mockResolvedValue({ status: 'ok' });

      // Act
      const result = await controller.check();

      // Log mock calls to debug
      console.log('TypeOrmHealthIndicator calls:', mockTypeOrmHealthIndicator.pingCheck.mock.calls);
      console.log('HttpHealthIndicator calls:', mockHttpHealthIndicator.pingCheck.mock.calls);

      // Assert
      expect(result).toEqual({ status: 'ok' });
      expect(mockTypeOrmHealthIndicator.pingCheck).toHaveBeenCalledWith('database');
      expect(mockHttpHealthIndicator.pingCheck).toHaveBeenCalledWith(
        'api-docs',
        'http://localhost/api-docs'
      );
    });

    it('should perform a health check with only database when not in development', async () => {
      // Arrange
      mockConfigService.get = jest.fn()
        .mockReturnValueOnce(Environment.PRODUCTION); // Assuming PRODUCTION is not development
      mockTypeOrmHealthIndicator.pingCheck = jest.fn().mockReturnValue(of({ status: 'ok' }));
      mockHealthCheckService.check = jest.fn().mockResolvedValue({ status: 'ok' });

      // Act
      const result = await controller.check();

      // Log mock calls to debug
      console.log('TypeOrmHealthIndicator calls:', mockTypeOrmHealthIndicator.pingCheck.mock.calls);
      console.log('HttpHealthIndicator calls:', mockHttpHealthIndicator.pingCheck.mock.calls);

      // Assert
      expect(result).toEqual({ status: 'ok' });
      expect(mockTypeOrmHealthIndicator.pingCheck).toHaveBeenCalledWith('database');
      expect(mockHttpHealthIndicator.pingCheck).not.toHaveBeenCalled();
    });

    it('should handle errors thrown by health check service', async () => {
      // Arrange
      mockConfigService.get = jest.fn()
        .mockReturnValueOnce(Environment.DEVELOPMENT)
        .mockReturnValueOnce('http://localhost');
      mockHttpHealthIndicator.pingCheck = jest.fn().mockReturnValue(of({ status: 'ok' }));
      mockTypeOrmHealthIndicator.pingCheck = jest.fn().mockReturnValue(of({ status: 'ok' }));
      mockHealthCheckService.check = jest.fn().mockRejectedValue(new Error('Health check failed'));

      // Act & Assert
      await expect(controller.check()).rejects.toThrow('Health check failed');
    });
  });
});
