import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../../core/decorators/current-user.decorator';
import { Public }      from '../../../core/decorators/public.decorator';
import type { JwtPayload }  from '../../../common/interfaces/jwt-payload.interface';

/** Stub controller — full implementation in future milestone */
@ApiTags('cart')
@Controller('cart')
@ApiBearerAuth()
export class CartController {
  @Get()
  @Public()
  getCart(@CurrentUser() user?: JwtPayload) {
    return { customerId: user?.sub ?? null, items: [], message: 'Cart endpoint (stub)' };
  }

  @Post('items')
  addItem(@CurrentUser() user: JwtPayload, @Body() _body: unknown) {
    return { customerId: user.sub, message: 'Add to cart (stub)' };
  }

  @Patch('items/:variantId')
  updateItem(
    @CurrentUser() user: JwtPayload,
    @Param('variantId') variantId: string,
    @Body() _body: unknown,
  ) {
    return { customerId: user.sub, variantId, message: 'Update cart item (stub)' };
  }

  @Delete('items/:variantId')
  removeItem(@CurrentUser() user: JwtPayload, @Param('variantId') variantId: string) {
    return { customerId: user.sub, variantId, message: 'Remove from cart (stub)' };
  }
}
