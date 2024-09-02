import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Dashboard from 'supertokens-node/recipe/dashboard';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';
import ThirdParty from 'supertokens-node/recipe/thirdparty';
import UserRoles from 'supertokens-node/recipe/userroles';

import { AuthConfig, ConfigInjectionToken } from './config/auth-config.type';

@Injectable()
export class SupertokensService {
  constructor(@Inject(ConfigInjectionToken) config: AuthConfig) {
    supertokens.init({
      debug: true,
      appInfo: config.appInfo,
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      recipeList: [
        EmailPassword.init(),
        ThirdParty.init({
          // We have provided you with development keys which you can use for testing.
          // IMPORTANT: Please replace them with your own OAuth keys for production use.
          signInAndUpFeature: {
            providers: [
              {
                config: {
                  thirdPartyId: 'google',
                  clients: [
                    {
                      clientId: config.social.google.clientId,
                      clientSecret: config.social.google.clientSecret,
                    },
                  ],
                },
              },
              {
                config: {
                  thirdPartyId: 'github',
                  clients: [
                    {
                      clientId: config.social.github.clientId,
                      clientSecret: config.social.github.clientSecret,
                    },
                  ],
                },
              },
              {
                config: {
                  thirdPartyId: 'apple',
                  clients: [
                    {
                      clientId: config.social.apple.clientId,
                      additionalConfig: {
                        keyId: config.social.apple.keyId,
                        privateKey: config.social.apple.privateKey,
                        teamId: config.social.apple.teamId,
                      },
                    },
                  ],
                },
              },
              {
                config: {
                  thirdPartyId: 'facebook',
                  clients: [
                    {
                      clientId: config.social.facebook.clientId,
                      clientSecret: config.social.facebook.clientSecret,
                    },
                  ],
                },
              },
            ],
          },
        }),
        Session.init(),
        UserRoles.init(),
        Dashboard.init({
          admins: ['office@decodex.net'],
        }),
      ],
    });
  }
}
