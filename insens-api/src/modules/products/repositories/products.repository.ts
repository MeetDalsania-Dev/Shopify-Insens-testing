import { Injectable } from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, asc, count, desc, eq, gte, lte } from 'drizzle-orm';
import * as schema        from '../../../database/schema';
import { InjectDatabase } from '../../../database/database.decorator';
import { getOffset, normalizePagination } from '../../../common/helpers/pagination.helper';

export interface ProductFilters {
  shopId?:      string;
  categoryId?:  string;
  minPrice?:    number;
  maxPrice?:    number;
  page?:        number;
  limit?:       number;
  sortBy?:      'price' | 'createdAt';
  order?:       'asc' | 'desc';
}

@Injectable()
export class ProductsRepository {
  constructor(@InjectDatabase() private readonly db: NodePgDatabase<typeof schema>) {}

  async create(data: schema.NewProduct) {
    const [product] = await this.db.insert(schema.products).values(data).returning();
    return product;
  }

  async findById(id: string) {
    return this.db.query.products.findFirst({
      where: eq(schema.products.id, id),
      with:  { shop: true, category: true },
    } as any);
  }

  async findAll(filters: ProductFilters) {
    const { page, limit } = normalizePagination(filters);
    const offset          = getOffset(page, limit);

    const conditions = [eq(schema.products.isActive, true)];
    if (filters.shopId)     conditions.push(eq(schema.products.shopId,     filters.shopId));
    if (filters.categoryId) conditions.push(eq(schema.products.categoryId, filters.categoryId));
    if (filters.minPrice)   conditions.push(gte(schema.products.price,     String(filters.minPrice)));
    if (filters.maxPrice)   conditions.push(lte(schema.products.price,     String(filters.maxPrice)));

    const where     = and(...conditions);
    const orderDir  = filters.order === 'asc' ? asc : desc;
    const orderCol  = filters.sortBy === 'price' ? schema.products.price : schema.products.createdAt;

    const [items, [{ value: total }]] = await Promise.all([
      this.db.query.products.findMany({
        where,
        limit,
        offset,
        orderBy: orderDir(orderCol),
        with:    { category: true },
      } as any),
      this.db.select({ value: count() }).from(schema.products).where(where),
    ]);

    return { items, total: Number(total), page, limit };
  }

  async update(id: string, data: Partial<schema.NewProduct>) {
    const [product] = await this.db
      .update(schema.products)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.products.id, id))
      .returning();
    return product;
  }

  async softDelete(id: string) {
    await this.db
      .update(schema.products)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(schema.products.id, id));
  }
}
