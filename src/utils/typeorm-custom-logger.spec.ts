import { Logger } from '@nestjs/common';
import TypeOrmCustomLogger from './typeorm-custom-logger';

describe('TypeOrmCustomLogger', () => {
  let logger: Logger;
  let typeOrmLogger: TypeOrmCustomLogger;

  beforeEach(() => {
    logger = new Logger('TypeORM[default]');
    jest.spyOn(logger, 'log').mockImplementation(jest.fn());
    jest.spyOn(logger, 'warn').mockImplementation(jest.fn());
    jest.spyOn(logger, 'error').mockImplementation(jest.fn());

    typeOrmLogger = new TypeOrmCustomLogger(logger, 'all');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('logQuery', () => {
    it('should log query and parameters when query logging is enabled', () => {
      const query = 'SELECT * FROM users';
      const parameters = ['param1', 'param2'];
      typeOrmLogger.logQuery(query, parameters);

      expect(logger.log).toHaveBeenCalledWith(
        'query: SELECT * FROM users -- PARAMETERS: ["param1","param2"]',
      );
    });

    it('should not log query when query logging is disabled', () => {
      typeOrmLogger = new TypeOrmCustomLogger(logger, []);
      typeOrmLogger.logQuery('SELECT * FROM users');

      expect(logger.log).not.toHaveBeenCalled();
    });
  });

  describe('logQueryError', () => {
    it('should log query error when query-error logging is enabled', () => {
      const query = 'SELECT * FROM users';
      const error = 'Some error';
      const parameters = ['param1'];

      typeOrmLogger.logQueryError(error, query, parameters);

      expect(logger.error).toHaveBeenCalledWith(
        'query failed: SELECT * FROM users -- PARAMETERS: ["param1"]',
      );
      expect(logger.error).toHaveBeenCalledWith('error:', error);
    });

    it('should not log query error when query-error logging is disabled', () => {
      typeOrmLogger = new TypeOrmCustomLogger(logger, []);
      typeOrmLogger.logQueryError('Some error', 'SELECT * FROM users');

      expect(logger.error).not.toHaveBeenCalled();
    });
  });

  describe('logQuerySlow', () => {
    it('should log slow query', () => {
      const query = 'SELECT * FROM users';
      const time = 1000;
      const parameters = ['param1'];

      typeOrmLogger.logQuerySlow(time, query, parameters);

      expect(logger.warn).toHaveBeenCalledWith(
        'query is slow: SELECT * FROM users -- PARAMETERS: ["param1"]',
      );
      expect(logger.warn).toHaveBeenCalledWith(`execution time: ${time}`);
    });
  });

  describe('logSchemaBuild', () => {
    it('should log schema build events when schema-build logging is enabled', () => {
      const message = 'Schema build started';

      typeOrmLogger.logSchemaBuild(message);

      expect(logger.log).toHaveBeenCalledWith(message);
    });

    it('should not log schema build events when schema-build logging is disabled', () => {
      typeOrmLogger = new TypeOrmCustomLogger(logger, []);
      typeOrmLogger.logSchemaBuild('Schema build started');

      expect(logger.log).not.toHaveBeenCalled();
    });
  });

  describe('logMigration', () => {
    it('should log migration events when migration logging is enabled', () => {
      const message = 'Migration started';

      typeOrmLogger.logMigration(message);

      expect(logger.log).toHaveBeenCalledWith(message);
    });
  });

  describe('log', () => {
    it('should log with level log', () => {
      const message = 'Some log message';

      typeOrmLogger.log('log', message);

      expect(logger.log).toHaveBeenCalledWith(message);
    });

    it('should log with level warn', () => {
      const message = 'Some warning message';

      typeOrmLogger.log('warn', message);

      expect(logger.warn).toHaveBeenCalledWith(message);
    });

    it('should not log when the log level is not enabled', () => {
      typeOrmLogger = new TypeOrmCustomLogger(logger, []);

      typeOrmLogger.log('log', 'Some log message');

      expect(logger.log).not.toHaveBeenCalled();
    });
  });

  describe('isLogEnabledFor', () => {
    it('should return true for enabled log levels', () => {
      expect(typeOrmLogger['isLogEnabledFor']('query')).toBe(true);
      expect(typeOrmLogger['isLogEnabledFor']('error')).toBe(true);
      expect(typeOrmLogger['isLogEnabledFor']('migration')).toBe(true);
    });

    it('should return false for disabled log levels', () => {
      typeOrmLogger = new TypeOrmCustomLogger(logger, []);
      expect(typeOrmLogger['isLogEnabledFor']('query')).toBe(false);
    });
  });

  describe('stringifyParams', () => {
    it('should stringify parameters', () => {
      const params = ['param1', 'param2'];
      expect(typeOrmLogger['stringifyParams'](params)).toBe(
        '["param1","param2"]',
      );
    });

    it('should handle circular objects', () => {
      const circularObj: any = {};
      circularObj.self = circularObj;

      expect(typeOrmLogger['stringifyParams']([circularObj])).toEqual([
        circularObj,
      ]);
    });
  });
});
