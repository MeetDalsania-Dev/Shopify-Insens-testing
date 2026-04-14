import { Injectable } from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, count, eq, ilike } from 'drizzle-orm';
import * as schema        from '../../../database/schema';
import { InjectDatabase } from '../../../database/database.decorator';
import { getOffset, normalizePagination } from '../../../common/helpers/pagination.helper';

export interface ShopFilters {
  status?: string;
  city?:   string;
  page?:   number;
  limit?:  number;
}

@Injectable()
export class ShopsRepository {
  constructor(@InjectDatabase() private readonly db: NodePgDatabase<typeof schema>) {}

  async create(data: schema.NewShop) {
    const [shop] = await this.db.insert(schema.shops).values(data).returning();
    return shop;
  }

  async findById(id: string) {
    return this.db.query.shops.findFirst({
      where: eq(schema.shops.id, id),
      with:  { owner: { columns: { id: true, email: true, firstName: true, lastName: true } } },
    } as any);
  }

  async findBySlug(slug: string) {
    return this.db.query.shops.findFirst({ where: eq(schema.shops.slug, slug) });
  }

  async findByOwnerId(ownerId: string) {
    return this.db.query.shops.findFirst({ where: eq(schema.shops.ownerId, ownerId) });
  }

  async findAll(filters: ShopFilters) {
    const { page, limit } = normalizePagination(filters);
    const offset          = getOffset(page, limit);

    const conditions = [];
    if (filters.status) conditions.push(eq(schema.shops.status, filters.status as any));
    if (filters.city)   conditions.push(ilike(schema.shops.city, `%${filters.city}%`));

    const where = conditions.length ? and(...conditions) : undefined;

    const [items, [{ value: total }]] = await Promise.all([
      this.db.query.shops.findMany({
        where,
        limit,
        offset,
        with: { owner: { columns: { id: true, email: true, firstName: true, lastName: true } } },
      } as any),
      this.db.select({ value: count() }).from(schema.shops).where(where),
    ]);

    return { items, total: Number(total), page, limit };
  }

  async update(id: string, data: Partial<schema.NewShop>) {
    const [shop] = await this.db
      .update(schema.shops)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.shops.id, id))
      .returning();
    return shop;
  }

  async slugExists(slug: string): Promise<boolean> {
    const result = await this.db
      .select({ value: count() })
      .from(schema.shops)
      .where(eq(schema.shops.slug, slug));
    return Number(result[0].value) > 0;
  }
}
