import { Inject, Injectable } from '@nestjs/common';
import supertokens, { RecipeUserId, User } from 'supertokens-node';
import Dashboard from 'supertokens-node/recipe/dashboard';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session, { SessionContainer } from 'supertokens-node/recipe/session';
import ThirdParty from 'supertokens-node/recipe/thirdparty';
import UserRoles, {
  PermissionClaim,
  UserRoleClaim,
} from 'supertokens-node/recipe/userroles';

import AccountLinking from 'supertokens-node/recipe/accountlinking';
import {
  AccountInfoWithRecipeId,
  RecipeLevelUser,
} from 'supertokens-node/recipe/accountlinking/types';
import { SessionContainerInterface } from 'supertokens-node/recipe/session/types';
import { UserService } from '../user/user.service';
import { AuthConfig, ConfigInjectionToken } from './config/auth-config.type';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Injectable()
export class SupertokensService {
  constructor(
    @Inject(ConfigInjectionToken) config: AuthConfig,
    private readonly userService: UserService,
  ) {
    supertokens.init({
      appInfo: config.appInfo,
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      recipeList: [
        EmailPassword.init({
          override: {
            functions: (originalImplementation) => {
              return {
                ...originalImplementation,
                // override the thirdparty sign in / up API
                signUp: async function (input) {
                  // TODO: Some pre sign in / up logic

                  const response = await originalImplementation.signUp(input);

                  if (response.status === 'OK') {
                    const { id, emails, phoneNumbers } = response.user;
                    createLocalUser(
                      {
                        id,
                        emails,
                        phoneNumbers,
                      },
                      userService,
                    );
                    addRoleToUser(response.user.id);
                    addRolesAndPermissionsToSession(input.session);
                  }

                  return response;
                },
              };
            },
          },
        }),
        ThirdParty.init({
          override: {
            functions: (originalImplementation) => {
              return {
                ...originalImplementation,
                // override the thirdparty sign in / up API
                signInUp: async function (input) {
                  // TODO: Some pre sign in / up logic

                  const response = await originalImplementation.signInUp(input);

                  if (response.status === 'OK') {
                    const { id, emails, phoneNumbers } = response.user;

                    // This is the response from the OAuth 2 provider that contains their tokens or user info.
                    const firstName =
                      response.rawUserInfoFromProvider.fromUserInfoAPI![
                        'first_name'
                      ];
                    const lastName =
                      response.rawUserInfoFromProvider.fromUserInfoAPI![
                        'last_name'
                      ];

                    if (input.session === undefined) {
                      if (
                        response.createdNewRecipeUser &&
                        response.user.loginMethods.length === 1
                      ) {
                        // Post sign up logic
                        addRoleToUser(response.user.id);
                      }
                      addRolesAndPermissionsToSession(input.session);
                      createLocalUser(
                        {
                          id,
                          emails,
                          phoneNumbers,
                          firstName,
                          lastName,
                        },
                        userService,
                      );
                    }
                  }

                  return response;
                },
              };
            },
          },
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
        AccountLinking.init({
          shouldDoAutomaticAccountLinking: async (
            newAccountInfo: AccountInfoWithRecipeId & {
              recipeUserId?: RecipeUserId;
            },
            user: User | undefined,
            session: SessionContainerInterface | undefined,
            tenantId: string,
            userContext: any,
          ) => {
            if (session !== undefined) {
              return {
                shouldAutomaticallyLink: false,
              };
            }
            if (
              newAccountInfo.recipeUserId !== undefined &&
              user !== undefined
            ) {
              const userId = newAccountInfo.recipeUserId.getAsString();
              const hasInfoAssociatedWithUserId = await hasUserWithExternalId(
                userId,
                userService,
              );
              if (hasInfoAssociatedWithUserId) {
                return {
                  shouldAutomaticallyLink: false,
                };
              }
            }
            return {
              shouldAutomaticallyLink: true,
              shouldRequireVerification: true,
            };
          },
          onAccountLinked: async (
            user: User,
            newAccountInfo: RecipeLevelUser,
            userContext: any,
          ) => {
            const olderUserId = newAccountInfo.recipeUserId.getAsString();
            const newUserId = user.id;

            // TODO: migrate data from olderUserId to newUserId in your database...
          },
        }),
        Session.init(),
        UserRoles.init(),
        Dashboard.init({
          admins: [config.adminUser],
        }),
      ],
    });
  }
}

export async function addRoleToUser(userId: string) {
  const response = await UserRoles.addRoleToUser('public', userId, 'user');

  if (response.status === 'UNKNOWN_ROLE_ERROR') {
    // No such role exists
    return;
  }

  if (response.didUserAlreadyHaveRole === true) {
    // The user already had the role
    return;
  }
}

export async function addRolesAndPermissionsToSession(
  session: SessionContainer,
) {
  // we add the user's roles to the user's session
  await session?.fetchAndSetClaim(UserRoleClaim);

  // we add the permissions of a user to the user's session
  await session?.fetchAndSetClaim(PermissionClaim);
}

export async function createLocalUser(
  user: {
    id: string;
    emails: string[];
    phoneNumbers: string[];
    firstName?: string;
    lastName?: string;
  },
  userService: UserService,
) {
  const isLocalUserPresent = await hasUserWithExternalId(user.id, userService);
  if (isLocalUserPresent) {
    return;
  }
  await userService.create(user);
}

export async function hasUserWithExternalId(
  userId: string,
  userService: UserService,
): Promise<boolean> {
  try {
    await userService.findOneByExternalId(userId);
    return true;
  } catch (e) {
    return false;
  }
}
