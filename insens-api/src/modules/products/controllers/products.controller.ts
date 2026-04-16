import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ProductsService }  from '../services/products.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { CreateVariantDto } from '../dtos/create-variant.dto';
import { UpdateVariantDto } from '../dtos/update-variant.dto';
import { Public }           from '../../../core/decorators/public.decorator';
import { CurrentUser }      from '../../../core/decorators/current-user.decorator';
import { JwtAuthGuard }     from '../../../core/guards/jwt-auth.guard';
import type { JwtPayload }  from '../../../common/interfaces/jwt-payload.interface';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ── Products ───────────────────────────────────────────────────────────────

  @Get()
  @Public()
  @ApiOperation({ summary: 'List products with filters (public)' })
  @ApiQuery({ name: 'vendorId',   required: false, description: 'Filter by vendor UUID' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category UUID' })
  @ApiQuery({ name: 'brandId',    required: false, description: 'Filter by brand UUID' })
  @ApiQuery({ name: 'status',     required: false, enum: ['draft', 'pending_review', 'active', 'archived'] })
  @ApiQuery({ name: 'page',       required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit',      required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: 'Paginated list of products' })
  listProducts(
    @Query('vendorId')   vendorId?:   string,
    @Query('categoryId') categoryId?: string,
    @Query('brandId')    brandId?:    string,
    @Query('status')     status?:     string,
    @Query('page')       page?:       number,
    @Query('limit')      limit?:      number,
  ) {
    return this.productsService.listProducts({ vendorId, categoryId, brandId, status, page, limit });
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get product by ID with variants (public)' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({ status: 200, description: 'Product details including all variants' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  getProduct(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product (vendor owner)' })
  @ApiResponse({ status: 201, description: 'Product created with status draft' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Slug already taken' })
  createProduct(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateProductDto,
  ) {
    return this.productsService.createProduct(dto, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (vendor owner)' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({ status: 200, description: 'Updated product' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
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
  @ApiOperation({ summary: 'Archive / soft-delete product (vendor owner)' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({ status: 200, description: 'Product archived (status set to archived)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  deleteProduct(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.productsService.updateProduct(id, { status: 'archived' } as any, user);
  }

  // ── Variants ───────────────────────────────────────────────────────────────

  @Post(':id/variants')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a variant to a product (vendor owner)', description: 'Each variant has its own SKU, price, and stock.' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({ status: 201, description: 'Variant created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: 'SKU already exists' })
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
  @ApiOperation({ summary: 'Update a product variant (vendor owner)' })
  @ApiParam({ name: 'id',        description: 'Product UUID' })
  @ApiParam({ name: 'variantId', description: 'Variant UUID' })
  @ApiResponse({ status: 200, description: 'Updated variant' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Variant not found' })
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
  @ApiOperation({ summary: 'Delete a product variant (vendor owner)' })
  @ApiParam({ name: 'id',        description: 'Product UUID' })
  @ApiParam({ name: 'variantId', description: 'Variant UUID' })
  @ApiResponse({ status: 200, description: 'Variant deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Variant not found' })
  deleteVariant(
    @Param('id')        productId: string,
    @Param('variantId') variantId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.productsService.deleteVariant(productId, variantId, user);
  }
}
