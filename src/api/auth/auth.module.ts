import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthMiddleware } from './auth.middleware';
import { AuthConfig, ConfigInjectionToken } from './config/auth-config.type';
import { SupertokensService } from './supertokens.service';

@Module({
  imports: [UserModule],
  providers: [UserService],
  exports: [],
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
        SupertokensService,
      ],
      exports: [],
      imports: [],
      module: AuthModule,
    };
  }

  static forRootAsync(): DynamicModule {
    return {
      module: AuthModule,
      imports: [ConfigModule], // Add any module dependencies here
      providers: [
        {
          provide: ConfigInjectionToken,
          useFactory: async (configService: ConfigService) => {
            return {
              connectionURI: configService.get<string>('auth.connectionURI'),
              apiKey: configService.get<string>('auth.apiKey'),
              appInfo: configService.get('auth.appInfo'),
              social: configService.get('auth.social'),
              adminUser: configService.get<string>('auth.adminUser'),
            };
          },
          inject: [ConfigService],
        },
        SupertokensService,
      ],
      exports: [ConfigInjectionToken], // Export if needed in other modules
    };
  }
}
