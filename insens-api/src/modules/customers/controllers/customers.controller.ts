import { Controller, Get, Patch, Body, Post, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../../core/decorators/current-user.decorator';
import type { JwtPayload }  from '../../../common/interfaces/jwt-payload.interface';

/** Stub controller — full implementation in future milestone */
@ApiTags('customers')
@Controller('customers')
@ApiBearerAuth()
export class CustomersController {
  @Get('me')
  getMe(@CurrentUser() user: JwtPayload) {
    return { userId: user.sub, message: 'Customer profile endpoint (stub)' };
  }

  @Patch('me')
  updateMe(@CurrentUser() user: JwtPayload, @Body() _body: unknown) {
    return { userId: user.sub, message: 'Update customer preferences (stub)' };
  }

  @Get('me/wishlists')
  getWishlists(@CurrentUser() user: JwtPayload) {
    return { userId: user.sub, items: [], message: 'Wishlists endpoint (stub)' };
  }

  @Post('me/wishlists')
  createWishlist(@CurrentUser() user: JwtPayload, @Body() _body: unknown) {
    return { userId: user.sub, message: 'Create wishlist (stub)' };
  }
}
