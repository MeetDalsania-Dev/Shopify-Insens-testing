import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository, ProductFilters } from '../repositories/products.repository';
import { CreateProductDto }  from '../dtos/create-product.dto';
import { UpdateProductDto }  from '../dtos/update-product.dto';
import { ShopsRepository }   from '../../shops/repositories/shops.repository';
import { buildPaginationMeta } from '../../../common/helpers/pagination.helper';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepo: ProductsRepository,
    private readonly shopsRepo:    ShopsRepository,
  ) {}

  async createProduct(shopId: string, dto: CreateProductDto) {
    const shop = await this.shopsRepo.findById(shopId);
    if (!shop) throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Shop not found' });

    if ((shop as any).status !== 'APPROVED') {
      throw new ForbiddenException({ code: 'SHOP_NOT_APPROVED', message: 'Your shop must be approved before adding products' });
    }

    return this.productsRepo.create({
      shopId,
      name:        dto.name,
      description: dto.description ?? null,
      price:       String(dto.price),
      stock:       dto.stock,
      categoryId:  dto.categoryId ?? null,
      images:      dto.images     ?? [],
    });
  }

  async listProducts(filters: ProductFilters) {
    const { items, total, page, limit } = await this.productsRepo.findAll(filters);
    return buildPaginationMeta(items, total, page, limit);
  }

  async getProduct(id: string) {
    const product = await this.productsRepo.findById(id);
    if (!product || !(product as any).isActive) {
      throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Product not found' });
    }
    return product;
  }

  async updateProduct(productId: string, shopId: string, dto: UpdateProductDto) {
    const product = await this.productsRepo.findById(productId);
    if (!product) throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Product not found' });

    if ((product as any).shopId !== shopId) {
      throw new ForbiddenException({ code: 'OWNERSHIP_VIOLATION', message: 'You do not own this product' });
    }

    const updates: Record<string, unknown> = { ...dto };
    if (dto.price !== undefined) updates['price'] = String(dto.price);

    return this.productsRepo.update(productId, updates as any);
  }

  async deleteProduct(productId: string, shopId: string) {
    const product = await this.productsRepo.findById(productId);
    if (!product) throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Product not found' });

    if ((product as any).shopId !== shopId) {
      throw new ForbiddenException({ code: 'OWNERSHIP_VIOLATION', message: 'You do not own this product' });
    }

    await this.productsRepo.softDelete(productId);
    return { message: 'Product removed successfully' };
  }
}
