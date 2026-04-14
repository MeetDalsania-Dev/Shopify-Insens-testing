import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags }         from '@nestjs/swagger';
import { ShopsService }    from '../services/shops.service';
import { CreateShopDto }   from '../dtos/create-shop.dto';
import { UpdateShopDto }   from '../dtos/update-shop.dto';
import { ProductsService } from '../../products/services/products.service';
import { Public }          from '../../../core/decorators/public.decorator';
import { Roles }           from '../../../core/decorators/roles.decorator';
import { CurrentUser }     from '../../../core/decorators/current-user.decorator';
import { RolesGuard }      from '../../../core/guards/roles.guard';
import { ShopOwnerGuard }  from '../../../core/guards/shop-owner.guard';
import type { JwtPayload }      from '../../../common/interfaces/jwt-payload.interface';
import { UserRole }        from '../../../common/constants/roles.constant';

@ApiTags('shops')
@Controller('shops')
export class ShopsController {
  constructor(
    private readonly shopsService:    ShopsService,
    private readonly productsService: ProductsService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.SHOP_OWNER)
  createShop(@CurrentUser() user: JwtPayload, @Body() dto: CreateShopDto) {
    return this.shopsService.createShop(user.sub, dto);
  }

  @Public()
  @Get()
  listShops(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('city') city?: string,
  ) {
    return this.shopsService.listShops({ page, limit, city });
  }

  @Public()
  @Get(':id')
  getShop(@Param('id') id: string) {
    return this.shopsService.getShop(id);
  }

  @Patch(':id')
  @UseGuards(ShopOwnerGuard)
  updateShop(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateShopDto,
  ) {
    return this.shopsService.updateShop(id, user.sub, dto);
  }

  /** GET /api/v1/shops/:shopId/products — public browse by shop */
  @Public()
  @Get(':shopId/products')
  getShopProducts(
    @Param('shopId') shopId: string,
    @Query('page')  page?:  number,
    @Query('limit') limit?: number,
  ) {
    return this.productsService.listProducts({ shopId, page, limit });
  }
}
