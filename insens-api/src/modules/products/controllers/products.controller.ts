import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags }         from '@nestjs/swagger';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Public }          from '../../../core/decorators/public.decorator';
import { CurrentUser }     from '../../../core/decorators/current-user.decorator';
import { ShopOwnerGuard }  from '../../../core/guards/shop-owner.guard';
import type { JwtPayload }      from '../../../common/interfaces/jwt-payload.interface';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  listProducts(
    @Query('categoryId') categoryId?: string,
    @Query('shopId')     shopId?:     string,
    @Query('minPrice')   minPrice?:   number,
    @Query('maxPrice')   maxPrice?:   number,
    @Query('sortBy')     sortBy?:     'price' | 'createdAt',
    @Query('order')      order?:      'asc' | 'desc',
    @Query('page')       page?:       number,
    @Query('limit')      limit?:      number,
  ) {
    return this.productsService.listProducts({ categoryId, shopId, minPrice, maxPrice, sortBy, order, page, limit });
  }

  @Public()
  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }

  @Post()
  @UseGuards(ShopOwnerGuard)
  createProduct(@CurrentUser() user: JwtPayload, @Body() dto: CreateProductDto) {
    return this.productsService.createProduct(user.shopId!, dto);
  }

  @Patch(':id')
  @UseGuards(ShopOwnerGuard)
  updateProduct(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, user.shopId!, dto);
  }

  @Delete(':id')
  @UseGuards(ShopOwnerGuard)
  @HttpCode(HttpStatus.OK)
  deleteProduct(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.productsService.deleteProduct(id, user.shopId!);
  }
}
