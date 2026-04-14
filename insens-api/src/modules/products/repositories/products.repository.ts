import { Injectable }     from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq, sql }   from 'drizzle-orm';
import * as schema        from '../../../database/schema';
import { InjectDatabase } from '../../../database/database.decorator';

export interface ProductFilters {
  vendorId?:    string;
  categoryId?:  string;
  brandId?:     string;
  status?:      string;
  page?:        number;
  limit?:       number;
}

@Injectable()
export class ProductsRepository {
  constructor(@InjectDatabase() private readonly db: NodePgDatabase<typeof schema>) {}

  // ── Products ──────────────────────────────────────────────────────────────

  async create(data: schema.NewProduct) {
    const [product] = await this.db.insert(schema.products).values(data).returning();
    return product;
  }

  async findById(id: string) {
    return this.db.query.products.findFirst({
      where: eq(schema.products.id, id),
    });
  }

  async findByIdWithVariants(id: string) {
    const product = await this.db.query.products.findFirst({
      where: eq(schema.products.id, id),
    });

    if (!product) return null;

    const variants = await this.db.query.productVariants.findMany({
      where: eq(schema.productVariants.productId, id),
    });

    return { ...product, variants };
  }

  async findAll(filters: ProductFilters) {
    const page   = filters.page  ?? 1;
    const limit  = filters.limit ?? 20;
    const offset = (page - 1) * limit;

    const conditions: ReturnType<typeof eq>[] = [];
    if (filters.vendorId)   conditions.push(eq(schema.products.vendorId,   filters.vendorId));
    if (filters.categoryId) conditions.push(eq(schema.products.categoryId, filters.categoryId));
    if (filters.brandId)    conditions.push(eq(schema.products.brandId,    filters.brandId));
    if (filters.status)     conditions.push(eq(schema.products.status,     filters.status as any));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [items, [{ count }]] = await Promise.all([
      this.db
        .select()
        .from(schema.products)
        .where(whereClause)
        .limit(limit)
        .offset(offset),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.products)
        .where(whereClause),
    ]);

    return { items, total: count, page, limit };
  }

  async update(id: string, data: Partial<schema.NewProduct>) {
    const [product] = await this.db
      .update(schema.products)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.products.id, id))
      .returning();
    return product;
  }

  // ── Variants ──────────────────────────────────────────────────────────────

  async createVariant(data: schema.NewProductVariant) {
    const [variant] = await this.db.insert(schema.productVariants).values(data).returning();
    return variant;
  }

  async findVariantById(id: string) {
    return this.db.query.productVariants.findFirst({
      where: eq(schema.productVariants.id, id),
    });
  }

  async findVariantsByProductId(productId: string) {
    return this.db.query.productVariants.findMany({
      where: eq(schema.productVariants.productId, productId),
    });
  }

  async updateVariant(id: string, data: Partial<schema.NewProductVariant>) {
    const [variant] = await this.db
      .update(schema.productVariants)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.productVariants.id, id))
      .returning();
    return variant;
  }

  async deleteVariant(id: string) {
    await this.db
      .delete(schema.productVariants)
      .where(eq(schema.productVariants.id, id));
  }
}
