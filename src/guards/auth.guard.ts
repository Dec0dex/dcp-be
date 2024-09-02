import { IS_AUTH_OPTIONAL, IS_PUBLIC } from '@/constants/app.constant';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getSession } from 'supertokens-node/recipe/session';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const isAuthOptional = this.reflector.getAllAndOverride<boolean>(
      IS_AUTH_OPTIONAL,
      [context.getHandler(), context.getClass()],
    );

    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const resp = ctx.getResponse();
    const session = await getSession(req, resp, {
      sessionRequired: !isAuthOptional,
    });
    req.session = session;
    return true;
  }
}
