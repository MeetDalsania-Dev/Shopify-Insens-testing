import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

/** Extract the authenticated user payload from the request. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtPayload }>();
    return request.user;
  },
);
