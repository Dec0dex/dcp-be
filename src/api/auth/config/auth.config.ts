import validateConfig from '@/utils/validate-config';
import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AuthConfig } from './auth-config.type';

export class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  AUTH_CONNECTION_URL: string;

  @IsString()
  @IsNotEmpty()
  AUTH_KEY: string;

  @IsString()
  @IsOptional()
  AUTH_GOOGLE_CLIENT_ID: string;

  @IsString()
  @IsOptional()
  AUTH_GOOGLE_CLIENT_SECRET: string;

  @IsString()
  @IsOptional()
  AUTH_FACEBOOK_CLIENT_ID: string;

  @IsString()
  @IsOptional()
  AUTH_FACEBOOK_CLIENT_SECRET: string;

  @IsString()
  @IsOptional()
  AUTH_GITHUB_CLIENT_ID: string;

  @IsString()
  @IsOptional()
  AUTH_GITHUB_CLIENT_SECRET: string;

  @IsString()
  @IsOptional()
  AUTH_APPLE_CLIENT_ID: string;

  @IsString()
  @IsOptional()
  AUTH_APPLE_KEY_ID: string;

  @IsString()
  @IsOptional()
  AUTH_APPLE_PRIVATE_KEY: string;

  @IsString()
  @IsOptional()
  AUTH_APPLE_TEAM_ID: string;

  @IsString()
  @IsOptional()
  AUTH_ADMIN_USER: string;
}

export default registerAs<AuthConfig>('auth', () => {
  console.info(`Register AuthConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    appInfo: {
      appName: process.env.APP_NAME,
      apiDomain: process.env.APP_URL,
      websiteDomain: process.env.APP_WEB_URL,
      apiBasePath: `${process.env.API_PREFIX}/auth`,
      websiteBasePath: '/auth',
    },
    social: {
      google: {
        clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
      },
      github: {
        clientId: process.env.AUTH_GITHUB_CLIENT_ID,
        clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET,
      },
      facebook: {
        clientId: process.env.AUTH_FACEBOOK_CLIENT_ID,
        clientSecret: process.env.AUTH_FACEBOOK_CLIENT_SECRET,
      },
      apple: {
        clientId: process.env.AUTH_APPLE_CLIENT_ID,
        keyId: process.env.AUTH_APPLE_KEY_ID,
        privateKey: process.env.AUTH_APPLE_PRIVATE_KEY,
        teamId: process.env.AUTH_APPLE_TEAM_ID,
      },
    },
    connectionURI: process.env.AUTH_CONNECTION_URL,
    apiKey: process.env.AUTH_KEY,
    adminUser: process.env.AUTH_ADMIN_USER || 'office@decodex.net',
  };
});
