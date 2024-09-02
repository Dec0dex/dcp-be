import { AppInfo } from 'supertokens-node/types';

export const ConfigInjectionToken = 'AuthConfigIInjectionToken';

export type AuthConfig = {
  appInfo: AppInfo;
  connectionURI: string;
  apiKey: string;
  adminUser: string;
  social: {
    google: {
      clientId: string;
      clientSecret: string;
    };
    github: {
      clientId: string;
      clientSecret: string;
    };
    facebook: {
      clientId: string;
      clientSecret: string;
    };
    apple: {
      clientId: string;
      keyId: string;
      privateKey: string;
      teamId: string;
    };
  };
};
