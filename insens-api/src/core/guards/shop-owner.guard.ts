import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

/**
 * Ensures the authenticated user is a SHOP_OWNER who has completed onboarding
 * (i.e. their shopId is populated in the JWT payload).
 *
 * The actual ownership check (product.shopId === user.shopId) is delegated to
 * the service layer for flexibility.
 */
@Injectable()
export class ShopOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: JwtPayload }>();
    const user    = request.user;

    if (user.role !== 'SHOP_OWNER') {
      throw new ForbiddenException({
        code:    'FORBIDDEN',
        message: 'Only shop owners can perform this action',
      });
    }

    if (!user.shopId) {
      throw new ForbiddenException({
        code:    'SHOP_NOT_APPROVED',
        message: 'Please complete shop onboarding before managing products',
      });
    }

    return true;
  }
}
