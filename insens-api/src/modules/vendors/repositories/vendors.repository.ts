import { Injectable }     from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, sql }        from 'drizzle-orm';
import * as schema        from '../../../database/schema';
import { InjectDatabase } from '../../../database/database.decorator';

@Injectable()
export class VendorsRepository {
  constructor(@InjectDatabase() private readonly db: NodePgDatabase<typeof schema>) {}

  async create(data: schema.NewVendor) {
    const [vendor] = await this.db.insert(schema.vendors).values(data).returning();
    return vendor;
  }

  async findById(id: string) {
    return this.db.query.vendors.findFirst({ where: eq(schema.vendors.id, id) });
  }

  async findBySlug(slug: string) {
    return this.db.query.vendors.findFirst({ where: eq(schema.vendors.slug, slug) });
  }

  async findAll(filters: { status?: string; page: number; limit: number }) {
    const { page, limit } = filters;
    const offset = (page - 1) * limit;

    const conditions = [];
    if (filters.status) {
      conditions.push(eq(schema.vendors.status, filters.status as any));
    }

    const whereClause = conditions.length > 0 ? conditions[0] : undefined;

    const [items, [{ count }]] = await Promise.all([
      this.db
        .select()
        .from(schema.vendors)
        .where(whereClause)
        .limit(limit)
        .offset(offset),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.vendors)
        .where(whereClause),
    ]);

    return { items, total: count, page, limit };
  }

  async update(id: string, data: Partial<schema.NewVendor>) {
    const [vendor] = await this.db
      .update(schema.vendors)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.vendors.id, id))
      .returning();
    return vendor;
  }

  async linkUser(vendorId: string, userId: string, role: 'owner' | 'manager' = 'owner') {
    await this.db
      .insert(schema.vendorUsers)
      .values({ vendorId, userId, role })
      .onConflictDoNothing();
  }

  async isUserLinked(vendorId: string, userId: string) {
    const row = await this.db.query.vendorUsers.findFirst({
      where: eq(schema.vendorUsers.vendorId, vendorId),
    });
    return !!row;
  }
}
