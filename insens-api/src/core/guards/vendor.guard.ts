import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { UserRole }    from '../../common/constants/roles.constant';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

/**
 * Ensures the authenticated user has the `vendor_owner` role.
 * Ownership checks (vendorId === route param) are delegated to the service.
 */
@Injectable()
export class VendorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: JwtPayload }>();
    const user    = request.user;
    console.log(user);
    
    if (!user.roles?.includes(UserRole.VENDOR_OWNER)) {
      throw new ForbiddenException({
        code:    'FORBIDDEN',
        message: 'Only vendor owners can perform this action',
      });
    }

    return true;
  }
}
