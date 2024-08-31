import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import TypeOrmCustomLogger from '../utils/typeorm-custom-logger';
import { TypeOrmConfigService } from './typeorm-config.service';

describe('TypeOrmConfigService', () => {
  let service: TypeOrmConfigService;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    configService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeOrmConfigService,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<TypeOrmConfigService>(TypeOrmConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTypeOrmOptions', () => {
    it('should return TypeOrmModuleOptions with correct values', () => {
      configService.get.mockImplementation((key: string) => {
        const config = {
          'database.type': 'postgres',
          'database.host': 'localhost',
          'database.port': 5432,
          'database.username': 'user',
          'database.password': 'password',
          'database.name': 'testdb',
          'database.synchronize': true,
          'database.logging': true,
          'database.maxConnections': 10,
          'database.sslEnabled': true,
          'database.rejectUnauthorized': false,
          'database.ca': 'ca-cert',
          'database.key': 'key',
          'database.cert': 'cert',
        };
        return config[key];
      });

      const options = service.createTypeOrmOptions() as any;

      expect(options).toEqual({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'user',
        password: 'password',
        database: 'testdb',
        synchronize: true,
        dropSchema: false,
        keepConnectionAlive: true,
        logger: TypeOrmCustomLogger.getInstance('default', [
          'error',
          'warn',
          'query',
          'schema',
        ]),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        migrationsTableName: 'migrations',
        poolSize: 10,
        ssl: {
          rejectUnauthorized: false,
          ca: 'ca-cert',
          key: 'key',
          cert: 'cert',
        },
      });
    });

    it('should handle optional SSL configuration', () => {
      configService.get.mockImplementation((key: string) => {
        const config = {
          'database.sslEnabled': false,
        };
        return config[key];
      });

      const options = service.createTypeOrmOptions() as any;

      expect(options.ssl).toBeUndefined();
    });
  });
});
