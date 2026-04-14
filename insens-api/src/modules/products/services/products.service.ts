import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository, ProductFilters } from '../repositories/products.repository';
import { CreateProductDto }  from '../dtos/create-product.dto';
import { UpdateProductDto }  from '../dtos/update-product.dto';
import { CreateVariantDto }  from '../dtos/create-variant.dto';
import { UpdateVariantDto }  from '../dtos/update-variant.dto';
import type { JwtPayload }        from '../../../common/interfaces/jwt-payload.interface';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepo: ProductsRepository) {}

  // ── Products ──────────────────────────────────────────────────────────────

  async createProduct(dto: CreateProductDto, user: JwtPayload) {
    if (!user.vendorId) {
      throw new ForbiddenException({
        code:    'VENDOR_REQUIRED',
        message: 'You must have an approved vendor account to add products',
      });
    }

    return this.productsRepo.create({
      vendorId:         user.vendorId,
      brandId:          dto.brandId    ?? null,
      categoryId:       dto.categoryId ?? null,
      title:            dto.title,
      slug:             dto.slug,
      shortDescription: dto.shortDescription ?? null,
      description:      dto.description      ?? null,
      productType:      (dto.productType ?? 'simple') as any,
      status:           'draft',
      approvalStatus:   'pending_review',
    });
  }

  async listProducts(filters: ProductFilters) {
    const { items, total, page, limit } = await this.productsRepo.findAll(filters);
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getProduct(id: string) {
    const product = await this.productsRepo.findByIdWithVariants(id);
    if (!product) {
      throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Product not found' });
    }
    return product;
  }

  async updateProduct(productId: string, dto: UpdateProductDto, user: JwtPayload) {
    const product = await this.productsRepo.findById(productId);
    if (!product) {
      throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Product not found' });
    }

    if (product.vendorId !== user.vendorId) {
      throw new ForbiddenException({ code: 'OWNERSHIP_VIOLATION', message: 'You do not own this product' });
    }

    return this.productsRepo.update(productId, dto as any);
  }

  // ── Variants ──────────────────────────────────────────────────────────────

  async createVariant(productId: string, dto: CreateVariantDto, user: JwtPayload) {
    const product = await this.productsRepo.findById(productId);
    if (!product) {
      throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Product not found' });
    }

    if (product.vendorId !== user.vendorId) {
      throw new ForbiddenException({ code: 'OWNERSHIP_VIOLATION', message: 'You do not own this product' });
    }

    return this.productsRepo.createVariant({
      productId,
      sku:       dto.sku,
      barcode:   dto.barcode   ?? null,
      title:     dto.title     ?? null,
      mrp:       dto.mrp,
      salePrice: dto.salePrice,
      costPrice: dto.costPrice ?? null,
      stock:     dto.stock     ?? 0,
    });
  }

  async updateVariant(productId: string, variantId: string, dto: UpdateVariantDto, user: JwtPayload) {
    const product = await this.productsRepo.findById(productId);
    if (!product) {
      throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Product not found' });
    }

    if (product.vendorId !== user.vendorId) {
      throw new ForbiddenException({ code: 'OWNERSHIP_VIOLATION', message: 'You do not own this product' });
    }

    const variant = await this.productsRepo.findVariantById(variantId);
    if (!variant || variant.productId !== productId) {
      throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Variant not found' });
    }

    return this.productsRepo.updateVariant(variantId, dto as any);
  }

  async deleteVariant(productId: string, variantId: string, user: JwtPayload) {
    const product = await this.productsRepo.findById(productId);
    if (!product) {
      throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Product not found' });
    }

    if (product.vendorId !== user.vendorId) {
      throw new ForbiddenException({ code: 'OWNERSHIP_VIOLATION', message: 'You do not own this product' });
    }

    await this.productsRepo.deleteVariant(variantId);
    return { message: 'Variant removed successfully' };
  }
}
