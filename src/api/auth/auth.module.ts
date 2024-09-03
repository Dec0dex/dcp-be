import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthMiddleware } from './auth.middleware';
import { AuthConfig, ConfigInjectionToken } from './config/auth-config.type';
import { SupertokensService } from './supertokens.service';

@Module({
  imports: [UserModule, ConfigModule],
  providers: [UserService, SupertokensService],
  exports: [SupertokensService], // Export SupertokensService if needed
  controllers: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }

  static forRoot({
    connectionURI,
    apiKey,
    appInfo,
    social,
    adminUser,
  }: AuthConfig): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        {
          useValue: {
            appInfo,
            connectionURI,
            social,
            apiKey,
            adminUser,
          },
          provide: ConfigInjectionToken,
        },
        UserService,
        SupertokensService,
      ],
      imports: [UserModule],
    };
  }

  static forRootAsync(): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        ConfigModule,
        UserModule,
        TypeOrmModule.forFeature([UserEntity]),
      ],
      providers: [
        {
          provide: ConfigInjectionToken,
          useFactory: async (configService: ConfigService) => ({
            connectionURI: configService.get<string>('auth.connectionURI'),
            apiKey: configService.get<string>('auth.apiKey'),
            appInfo: configService.get('auth.appInfo'),
            social: configService.get('auth.social'),
            adminUser: configService.get<string>('auth.adminUser'),
          }),
          inject: [ConfigService],
        },
        UserService,
        SupertokensService,
      ],
      exports: [ConfigInjectionToken, SupertokensService], // Export if needed
    };
  }
}
