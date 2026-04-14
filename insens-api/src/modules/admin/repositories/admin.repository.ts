import { Injectable } from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, count, eq, ilike } from 'drizzle-orm';
import * as schema        from '../../../database/schema';
import { InjectDatabase } from '../../../database/database.decorator';
import { getOffset, normalizePagination } from '../../../common/helpers/pagination.helper';

export interface AdminShopFilters {
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
    const [buyers, pending, approved, suspended, products] = await Promise.all([
      this.db.select({ value: count() }).from(schema.users).where(eq(schema.users.role, 'BUYER')),
      this.db.select({ value: count() }).from(schema.shops).where(eq(schema.shops.status, 'PENDING')),
      this.db.select({ value: count() }).from(schema.shops).where(eq(schema.shops.status, 'APPROVED')),
      this.db.select({ value: count() }).from(schema.shops).where(eq(schema.shops.status, 'SUSPENDED')),
      this.db.select({ value: count() }).from(schema.products).where(eq(schema.products.isActive, true)),
    ]);

    return {
      totalBuyers:          Number(buyers[0].value),
      totalShops:           Number(pending[0].value) + Number(approved[0].value) + Number(suspended[0].value),
      totalPendingShops:    Number(pending[0].value),
      totalApprovedShops:   Number(approved[0].value),
      totalSuspendedShops:  Number(suspended[0].value),
      totalProducts:        Number(products[0].value),
    };
  }

  // ── Shops ─────────────────────────────────────────────────────────────────

  async findAllShops(filters: AdminShopFilters) {
    const { page, limit } = normalizePagination(filters);
    const offset          = getOffset(page, limit);
    const conditions = filters.status ? [eq(schema.shops.status, filters.status as any)] : [];
    const where      = conditions.length ? and(...conditions) : undefined;
    
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

  async findShopById(id: string) {
    return this.db.query.shops.findFirst({
      where: eq(schema.shops.id, id),
      with:  { owner: { columns: { id: true, email: true, firstName: true, lastName: true } } },
    } as any);
  }

  async updateShopStatus(id: string, status: 'APPROVED' | 'SUSPENDED') {
    const [shop] = await this.db
      .update(schema.shops)
      .set({ status, updatedAt: new Date() })
      .where(eq(schema.shops.id, id))
      .returning();
    return shop;
  }

  // ── Users ─────────────────────────────────────────────────────────────────

  async findAllUsers(filters: AdminUserFilters) {
    const { page, limit } = normalizePagination(filters);
    const offset          = getOffset(page, limit);

    const [items, [{ value: total }]] = await Promise.all([
      this.db.query.users.findMany({ limit, offset }),
      this.db.select({ value: count() }).from(schema.users),
    ]);

    return {
      items: items.map(({ password: _pw, ...u }) => u),
      total: Number(total),
      page,
      limit,
    };
  }

  async findUserById(id: string) {
    const user = await this.db.query.users.findFirst({ where: eq(schema.users.id, id) });
    if (!user) return null;
    const { password: _pw, ...safe } = user;
    return safe;
  }

  async deactivateUser(id: string) {
    const [user] = await this.db
      .update(schema.users)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();
    const { password: _pw, ...safe } = user;
    return safe;
  }
}
