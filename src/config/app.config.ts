import { Environment, LogService } from '@/constants/app.constant';
import { registerAs } from '@nestjs/config';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import process from 'node:process';
import validateConfig from '../utils/validate-config';
import { AppConfig } from './app-config.type';

export class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsString()
  @IsOptional()
  APP_NAME: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  APP_URL: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  APP_WEB_URL: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;

  @IsBoolean()
  @IsOptional()
  APP_DEBUG: boolean;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsString()
  @IsOptional()
  APP_FALLBACK_LANGUAGE: string;

  @IsString()
  @IsOptional()
  APP_LOG_LEVEL: string;

  @IsString()
  @IsEnum(LogService)
  @IsOptional()
  APP_LOG_SERVICE: string;

  @IsString()
  @IsOptional()
  APP_CORS_ORIGIN: string;
}

export default registerAs<AppConfig>('app', () => {
  console.info(`Register AppConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);

  const port = process.env.APP_PORT
    ? parseInt(process.env.APP_PORT, 10)
    : process.env.PORT
      ? parseInt(process.env.PORT, 10)
      : 3000;

  return {
    nodeEnv: process.env.NODE_ENV || Environment.DEVELOPMENT,
    name: process.env.APP_NAME || 'app',
    webUrl: process.env.APP_WEB_URL || 'http://localhost:4200',
    url: process.env.APP_URL || `http://localhost:${port}`,
    port,
    debug: process.env.APP_DEBUG === 'true',
    apiPrefix: process.env.API_PREFIX || 'api',
    fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
    logLevel: process.env.APP_LOG_LEVEL || 'warn',
    logService: process.env.APP_LOG_SERVICE || LogService.CONSOLE,
    corsOrigin: getCorsOrigin() || true,
  };
});

export function getCorsOrigin() {
  const corsOrigin = process.env.APP_CORS_ORIGIN;
  if (corsOrigin === 'true') return true;
  if (corsOrigin === '*') return '*';
  return corsOrigin?.includes(',')
    ? corsOrigin.split(',').map((origin) => origin.trim())
    : false;
}
