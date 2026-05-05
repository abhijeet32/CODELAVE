import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserPayload {
  sub: string;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (
    data: keyof CurrentUserPayload | undefined,
    ctx: ExecutionContext,
  ): CurrentUserPayload | string => {
    const request = ctx.switchToHttp().getRequest();
    const user: CurrentUserPayload = request.user;
    return data ? user[data] : user;
  },
);
