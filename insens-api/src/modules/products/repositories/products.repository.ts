import { Injectable } from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq, sql } from 'drizzle-orm';
import * as schema from '../../../database/schema';
import { InjectDatabase } from '../../../database/database.decorator';
import { tryCatch } from '../../../common/helpers/try-catch.helper'; // adjust path

export interface ProductFilters {
  vendorId?: string;
  categoryId?: string;
  brandId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class ProductsRepository {
  constructor(@InjectDatabase() private readonly db: NodePgDatabase<typeof schema>) {}

  // ── Products ──────────────────────────────────────────────────────────────

  async create(data: schema.NewProduct) {
    const { data: rows, error } = await tryCatch(
      this.db.insert(schema.products).values(data).returning(),
      'ProductsRepository.create',
    );
    if (error) throw error;
    return rows[0];
  }

  async findById(id: string) {
    const { data, error } = await tryCatch(
      this.db.query.products.findFirst({ where: eq(schema.products.id, id) }),
      'ProductsRepository.findById',
    );
    if (error) throw error;
    return data;
  }

  async findByIdWithVariants(id: string) {
    const { data: product, error: productError } = await tryCatch(
      this.db.query.products.findFirst({ where: eq(schema.products.id, id) }),
      'ProductsRepository.findByIdWithVariants',
    );
    if (productError) throw productError;
    if (!product) return null;

    const { data: variants, error: variantsError } = await tryCatch(
      this.db.query.productVariants.findMany({
        where: eq(schema.productVariants.productId, id),
      }),
      'ProductsRepository.findByIdWithVariants.variants',
    );
    if (variantsError) throw variantsError;

    return { ...product, variants };
  }

  async findAll(filters: ProductFilters) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const offset = (page - 1) * limit;

    const conditions: ReturnType<typeof eq>[] = [];
    if (filters.vendorId) conditions.push(eq(schema.products.vendorId, filters.vendorId));
    if (filters.categoryId) conditions.push(eq(schema.products.categoryId, filters.categoryId));
    if (filters.brandId) conditions.push(eq(schema.products.brandId, filters.brandId));
    if (filters.status) conditions.push(eq(schema.products.status, filters.status as any));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const { data, error } = await tryCatch(
      Promise.all([
        this.db.select().from(schema.products).where(whereClause).limit(limit).offset(offset),
        this.db
          .select({ count: sql<number>`count(*)::int` })
          .from(schema.products)
          .where(whereClause),
      ]),
      'ProductsRepository.findAll',
    );
    if (error) throw error;

    const [items, [{ count }]] = data;
    return { items, total: count, page, limit };
  }

  async update(id: string, data: Partial<schema.NewProduct>) {
    const { data: rows, error } = await tryCatch(
      this.db
        .update(schema.products)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(schema.products.id, id))
        .returning(),
      'ProductsRepository.update',
    );
    if (error) throw error;
    return rows[0];
  }

  // ── Variants ──────────────────────────────────────────────────────────────

  async createVariant(data: schema.NewProductVariant) {
    const { data: rows, error } = await tryCatch(
      this.db.insert(schema.productVariants).values(data).returning(),
      'ProductsRepository.createVariant',
    );
    if (error) throw error;
    return rows[0];
  }

  async findVariantById(id: string) {
    const { data, error } = await tryCatch(
      this.db.query.productVariants.findFirst({ where: eq(schema.productVariants.id, id) }),
      'ProductsRepository.findVariantById',
    );
    if (error) throw error;
    return data;
  }

  async findVariantsByProductId(productId: string) {
    const { data, error } = await tryCatch(
      this.db.query.productVariants.findMany({
        where: eq(schema.productVariants.productId, productId),
      }),
      'ProductsRepository.findVariantsByProductId',
    );
    if (error) throw error;
    return data;
  }

  async updateVariant(id: string, data: Partial<schema.NewProductVariant>) {
    const { data: rows, error } = await tryCatch(
      this.db
        .update(schema.productVariants)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(schema.productVariants.id, id))
        .returning(),
      'ProductsRepository.updateVariant',
    );
    if (error) throw error;
    return rows[0];
  }

  async deleteVariant(id: string) {
    const { error } = await tryCatch(
      this.db.delete(schema.productVariants).where(eq(schema.productVariants.id, id)),
      'ProductsRepository.deleteVariant',
    );
    if (error) throw error;
  }

  // ── Perfume Details ───────────────────────────────────────────────────────

  async createPerfumeDetails(data: schema.NewPerfumeDetail) {
    const { data: rows, error } = await tryCatch(
      this.db.insert(schema.perfumeDetails).values(data).returning(),
      'ProductsRepository.createPerfumeDetails',
    );
    if (error) throw error;
    return rows[0];
  }

  async upsertPerfumeDetails(data: schema.NewPerfumeDetail) {
    const { data: rows, error } = await tryCatch(
      this.db
        .insert(schema.perfumeDetails)
        .values(data)
        .onConflictDoUpdate({ target: schema.perfumeDetails.productId, set: data })
        .returning(),
      'ProductsRepository.upsertPerfumeDetails',
    );
    if (error) throw error;
    return rows[0];
  }
}
