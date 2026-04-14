import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ShopsRepository }       from '../repositories/shops.repository';
import { CreateShopDto }         from '../dtos/create-shop.dto';
import { UpdateShopDto }         from '../dtos/update-shop.dto';
import { generateSlug, uniqueSlug } from '../../../common/helpers/slug.helper';
import { buildPaginationMeta }   from '../../../common/helpers/pagination.helper';

export interface ListShopsParams {
  status?: string;
  city?:   string;
  page?:   number;
  limit?:  number;
}

@Injectable()
export class ShopsService {
  constructor(private readonly shopsRepo: ShopsRepository) {}

  async createShop(ownerId: string, dto: CreateShopDto) {
    const existing = await this.shopsRepo.findByOwnerId(ownerId);
    if (existing) {
      throw new ConflictException({ code: 'CONFLICT', message: 'You already have a shop' });
    }

    const slug = await this.buildUniqueSlug(dto.name);

    return this.shopsRepo.create({
      ownerId,
      name:        dto.name,
      slug,
      description: dto.description ?? null,
      address:     dto.address     ?? null,
      city:        dto.city        ?? null,
      logoUrl:     dto.logoUrl     ?? null,
      status:      'PENDING',
    });
  }

  async listShops(params: ListShopsParams) {
    const { items, total, page, limit } = await this.shopsRepo.findAll({
      ...params,
      status: params.status ?? 'APPROVED',
    });
    return buildPaginationMeta(items, total, page, limit);
  }

  async getShop(idOrSlug: string) {
    const shop = await this.shopsRepo.findById(idOrSlug);
    if (!shop) throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Shop not found' });
    return shop;
  }

  async updateShop(shopId: string, ownerId: string, dto: UpdateShopDto) {
    const shop = await this.shopsRepo.findById(shopId);
    if (!shop) throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Shop not found' });

    if ((shop as any).ownerId !== ownerId) {
      throw new ForbiddenException({ code: 'OWNERSHIP_VIOLATION', message: 'You do not own this shop' });
    }

    const updates: Record<string, unknown> = { ...dto };

    if (dto.name && dto.name !== shop.name) {
      updates['slug'] = await this.buildUniqueSlug(dto.name);
    }

    return this.shopsRepo.update(shopId, updates as any);
  }

  private async buildUniqueSlug(name: string): Promise<string> {
    let slug = generateSlug(name);
    if (await this.shopsRepo.slugExists(slug)) {
      slug = uniqueSlug(slug);
    }
    return slug;
  }
}
