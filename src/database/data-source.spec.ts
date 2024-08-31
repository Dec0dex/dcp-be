import 'reflect-metadata';
import { AppDataSource } from './data-source';

// Mock the DataSource class
jest.mock('typeorm', () => {
  return {
    DataSource: jest.fn().mockImplementation(() => ({
      options: {
        type: 'postgres',
        url: 'fake-url',
        host: 'localhost',
        port: 5432,
        username: 'testuser',
        password: 'testpass',
        database: 'testdb',
        synchronize: true,
        dropSchema: false,
        keepConnectionAlive: true,
        logging: false,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        migrationsTableName: 'migrations',
        poolSize: 100,
        ssl: undefined,
        seeds: [__dirname + '/seeds/**/*{.ts,.js}'],
        seedTracking: true,
        factories: [__dirname + '/factories/**/*{.ts,.js}'],
      },
    })),
  };
});

describe('AppDataSource', () => {
  it('should create AppDataSource with expected options', () => {
    const options = (AppDataSource as unknown as { options: any }).options;

    expect(options.type).toBe('postgres');
    expect(options.url).toBe('fake-url');
    expect(options.host).toBe('localhost');
    expect(options.port).toBe(5432);
    expect(options.username).toBe('testuser');
    expect(options.password).toBe('testpass');
    expect(options.database).toBe('testdb');
    expect(options.synchronize).toBe(true);
    expect(options.dropSchema).toBe(false);
    expect(options.keepConnectionAlive).toBe(true);
    expect(options.logging).toBe(false);
    expect(options.entities).toEqual([__dirname + '/../**/*.entity{.ts,.js}']);
    expect(options.migrations).toEqual([
      __dirname + '/migrations/**/*{.ts,.js}',
    ]);
    expect(options.migrationsTableName).toBe('migrations');
    expect(options.poolSize).toBe(100);
    expect(options.ssl).toBeUndefined();
    expect(options.seeds).toEqual([__dirname + '/seeds/**/*{.ts,.js}']);
    expect(options.seedTracking).toBe(true);
    expect(options.factories).toEqual([__dirname + '/factories/**/*{.ts,.js}']);
  });
});
