import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService }   from '../services/products.service';
import { CreateProductDto }  from '../dtos/create-product.dto';
import { UpdateProductDto }  from '../dtos/update-product.dto';
import { CreateVariantDto }  from '../dtos/create-variant.dto';
import { UpdateVariantDto }  from '../dtos/update-variant.dto';
import { Public }            from '../../../core/decorators/public.decorator';
import { CurrentUser }       from '../../../core/decorators/current-user.decorator';
import { JwtAuthGuard }      from '../../../core/guards/jwt-auth.guard';
import type { JwtPayload }        from '../../../common/interfaces/jwt-payload.interface';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ── Products ───────────────────────────────────────────────────────────────

  @Get()
  @Public()
  listProducts(
    @Query('vendorId')    vendorId?:   string,
    @Query('categoryId')  categoryId?: string,
    @Query('brandId')     brandId?:    string,
    @Query('status')      status?:     string,
    @Query('page')        page?:       number,
    @Query('limit')       limit?:      number,
  ) {
    return this.productsService.listProducts({ vendorId, categoryId, brandId, status, page, limit });
  }

  @Get(':id')
  @Public()
  getProduct(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createProduct(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateProductDto,
  ) {
    return this.productsService.createProduct(dto, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateProduct(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, dto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  deleteProduct(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.productsService.updateProduct(id, { status: 'archived' } as any, user);
  }

  // ── Variants ───────────────────────────────────────────────────────────────

  @Post(':id/variants')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createVariant(
    @Param('id') productId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateVariantDto,
  ) {
    return this.productsService.createVariant(productId, dto, user);
  }

  @Patch(':id/variants/:variantId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateVariant(
    @Param('id')        productId: string,
    @Param('variantId') variantId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateVariantDto,
  ) {
    return this.productsService.updateVariant(productId, variantId, dto, user);
  }

  @Delete(':id/variants/:variantId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  deleteVariant(
    @Param('id')        productId: string,
    @Param('variantId') variantId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.productsService.deleteVariant(productId, variantId, user);
  }
}
