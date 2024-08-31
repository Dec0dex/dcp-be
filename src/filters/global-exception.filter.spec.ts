import { ErrorDto } from '@/common/dto/error.dto';
import { ErrorCode } from '@/constants/error-code.constant';
import { ValidationException } from '@/exceptions/validation.exception';
import {
  ArgumentsHost,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nContext } from 'nestjs-i18n';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { GlobalExceptionFilter } from './global-exception.filter';

describe('GlobalExceptionFilter', () => {
  let exceptionFilter: GlobalExceptionFilter;
  let configService: ConfigService;

  beforeEach(() => {
    configService = {
      getOrThrow: jest.fn().mockReturnValue(false),
    } as unknown as ConfigService;

    exceptionFilter = new GlobalExceptionFilter(configService);

    I18nContext.current = jest.fn().mockReturnValue({
      t: jest.fn().mockImplementation((key: string) => key), // return the key as translation
    });
  });

  it('should be defined', () => {
    expect(exceptionFilter).toBeDefined();
  });

  describe('catch method', () => {
    let mockResponse: any;
    let mockHost: ArgumentsHost;

    beforeEach(() => {
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockHost = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: jest.fn().mockReturnValue(mockResponse),
        }),
      } as unknown as ArgumentsHost;

      I18nContext.current = jest.fn().mockReturnValue({
        t: jest.fn((key: string) => key),
      });
    });

    it('should handle UnprocessableEntityException', () => {
      const exception = new UnprocessableEntityException();
      jest
        .spyOn(exceptionFilter, 'handleUnprocessableEntityException' as any)
        .mockReturnValue({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        } as ErrorDto);

      exceptionFilter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle ValidationException', () => {
      const exception = new ValidationException(
        ErrorCode.V0000,
        'Validation error message',
      );

      jest
        .spyOn(exceptionFilter, 'handleValidationException' as any)
        .mockReturnValue({ statusCode: HttpStatus.BAD_REQUEST } as ErrorDto);

      exceptionFilter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle QueryFailedError', () => {
      const exception = new QueryFailedError('query', [], new Error());
      jest
        .spyOn(exceptionFilter, 'handleQueryFailedError' as any)
        .mockReturnValue({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        } as ErrorDto);

      exceptionFilter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle EntityNotFoundError', () => {
      const exception = new EntityNotFoundError('entity', 'query');
      jest
        .spyOn(exceptionFilter, 'handleEntityNotFoundError' as any)
        .mockReturnValue({ statusCode: HttpStatus.NOT_FOUND } as ErrorDto);

      exceptionFilter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle unknown error', () => {
      const exception = new Error('Unknown error');
      jest.spyOn(exceptionFilter, 'handleError' as any).mockReturnValue({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      } as ErrorDto);

      exceptionFilter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('private methods', () => {
    it('should handle UnprocessableEntityException correctly', () => {
      const exception = new UnprocessableEntityException({
        message: [],
      });

      const errorRes =
        exceptionFilter['handleUnprocessableEntityException'](exception);

      expect(errorRes.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should handle ValidationException correctly', () => {
      const exception = new ValidationException(
        ErrorCode.V0000,
        'Validation error',
      );

      const errorRes = exceptionFilter['handleValidationException'](exception);

      expect(errorRes.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should handle QueryFailedError correctly', () => {
      const error = new QueryFailedError('query', [], new Error());
      exceptionFilter['i18n'] = I18nContext.current();
      const errorRes = exceptionFilter['handleQueryFailedError'](error);

      expect(errorRes.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should handle EntityNotFoundError correctly', () => {
      const error = new EntityNotFoundError('entity', 'query');
      exceptionFilter['i18n'] = I18nContext.current();
      const errorRes = exceptionFilter['handleEntityNotFoundError'](error);

      expect(errorRes.statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it('should handle generic Error correctly', () => {
      const error = new Error('Unknown error');

      const errorRes = exceptionFilter['handleError'](error);

      expect(errorRes.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
