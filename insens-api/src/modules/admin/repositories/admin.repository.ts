import { Injectable }     from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, sql }        from 'drizzle-orm';
import * as schema        from '../../../database/schema';
import { InjectDatabase } from '../../../database/database.decorator';

export interface AdminVendorFilters {
  status?: string;
  page?:   number;
  limit?:  number;
}

export interface AdminUserFilters {
  page?:  number;
  limit?: number;
}

@Injectable()
export class AdminRepository {
  constructor(@InjectDatabase() private readonly db: NodePgDatabase<typeof schema>) {}

  // ── Stats ────────────────────────────────────────────────────────────────

  async getStats() {
    const [
      totalUsersRes,
      pendingVendorsRes,
      activeVendorsRes,
      suspendedVendorsRes,
      totalProductsRes,
    ] = await Promise.all([
      this.db.select({ count: sql<number>`count(*)::int` }).from(schema.users),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.vendors)
        .where(eq(schema.vendors.status, 'pending')),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.vendors)
        .where(eq(schema.vendors.status, 'active')),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.vendors)
        .where(eq(schema.vendors.status, 'suspended')),
      this.db.select({ count: sql<number>`count(*)::int` }).from(schema.products),
    ]);

    return {
      totalUsers:           totalUsersRes[0].count,
      totalVendors:         pendingVendorsRes[0].count + activeVendorsRes[0].count + suspendedVendorsRes[0].count,
      totalPendingVendors:  pendingVendorsRes[0].count,
      totalActiveVendors:   activeVendorsRes[0].count,
      totalSuspendedVendors: suspendedVendorsRes[0].count,
      totalProducts:        totalProductsRes[0].count,
    };
  }

  // ── Vendors ───────────────────────────────────────────────────────────────

  async findAllVendors(filters: AdminVendorFilters) {
    const page   = filters.page  ?? 1;
    const limit  = filters.limit ?? 20;
    const offset = (page - 1) * limit;

    const whereClause = filters.status
      ? eq(schema.vendors.status, filters.status as any)
      : undefined;

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

  async findVendorById(id: string) {
    return this.db.query.vendors.findFirst({
      where: eq(schema.vendors.id, id),
    });
  }

  async updateVendor(id: string, data: Partial<schema.NewVendor>) {
    const [vendor] = await this.db
      .update(schema.vendors)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.vendors.id, id))
      .returning();
    return vendor;
  }

  // ── Users ─────────────────────────────────────────────────────────────────

  async findAllUsers(filters: AdminUserFilters) {
    const page   = filters.page  ?? 1;
    const limit  = filters.limit ?? 20;
    const offset = (page - 1) * limit;

    const [items, [{ count }]] = await Promise.all([
      this.db
        .select({
          id:              schema.users.id,
          email:           schema.users.email,
          status:          schema.users.status,
          authProvider:    schema.users.authProvider,
          isEmailVerified: schema.users.isEmailVerified,
          createdAt:       schema.users.createdAt,
        })
        .from(schema.users)
        .limit(limit)
        .offset(offset),
      this.db.select({ count: sql<number>`count(*)::int` }).from(schema.users),
    ]);

    return { items, total: count, page, limit };
  }

  async findUserById(id: string) {
    return this.db
      .select({
        id:              schema.users.id,
        email:           schema.users.email,
        status:          schema.users.status,
        authProvider:    schema.users.authProvider,
        isEmailVerified: schema.users.isEmailVerified,
        createdAt:       schema.users.createdAt,
      })
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .then((rows) => rows[0] ?? null);
  }

  async suspendUser(id: string) {
    const [user] = await this.db
      .update(schema.users)
      .set({ status: 'suspended', updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning({
        id:     schema.users.id,
        email:  schema.users.email,
        status: schema.users.status,
      });
    return user;
  }
}
