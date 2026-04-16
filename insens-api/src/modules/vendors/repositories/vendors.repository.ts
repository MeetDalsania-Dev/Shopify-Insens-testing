import { Injectable } from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, sql } from 'drizzle-orm';
import * as schema from '../../../database/schema';
import { InjectDatabase } from '../../../database/database.decorator';
import { UserRole } from '../../../common/constants/roles.constant';
import { tryCatch } from '../../../common/helpers/try-catch.helper';  // adjust path

@Injectable()
export class VendorsRepository {
  constructor(@InjectDatabase() private readonly db: NodePgDatabase<typeof schema>) {}

  async create(data: schema.NewVendor) {
    const { data: rows, error } = await tryCatch(
      this.db.insert(schema.vendors).values(data).returning(),
      'VendorsRepository.create',
    );
    if (error) throw error;
    return rows[0];
  }

  async findById(id: string) {
    const { data, error } = await tryCatch(
      this.db.query.vendors.findFirst({ where: eq(schema.vendors.id, id) }),
      'VendorsRepository.findById',
    );
    if (error) throw error;
    return data;
  }

  async findBySlug(slug: string) {
    const { data, error } = await tryCatch(
      this.db.query.vendors.findFirst({ where: eq(schema.vendors.slug, slug) }),
      'VendorsRepository.findBySlug',
    );
    if (error) throw error;
    return data;
  }

  async findAll(filters: { status?: string; page: number; limit: number }) {
    const { page, limit } = filters;
    const offset = (page - 1) * limit;

    const whereClause = filters.status
      ? eq(schema.vendors.status, filters.status as any)
      : undefined;

    const { data: results, error } = await tryCatch(
      Promise.all([
        this.db.select().from(schema.vendors).where(whereClause).limit(limit).offset(offset),
        this.db
          .select({ count: sql<number>`count(*)::int` })
          .from(schema.vendors)
          .where(whereClause),
      ]),
      'VendorsRepository.findAll',
    );
    if (error) throw error;

    const [items, [{ count }]] = results;
    return { items, total: count, page, limit };
  }

  async update(id: string, data: Partial<schema.NewVendor>) {
    const { data: rows, error } = await tryCatch(
      this.db
        .update(schema.vendors)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(schema.vendors.id, id))
        .returning(),
      'VendorsRepository.update',
    );
    if (error) throw error;
    return rows[0];
  }

  async linkUser(vendorId: string, userId: string, role: 'owner' | 'manager' = 'owner') {
    const { error } = await tryCatch(
      this.db.insert(schema.vendorUsers).values({ vendorId, userId, role }).onConflictDoNothing(),
      'VendorsRepository.linkUser',
    );
    if (error) throw error;
  }

  async isUserLinked(vendorId: string, userId: string) {
    const { data: row, error } = await tryCatch(
      this.db.query.vendorUsers.findFirst({
        where: eq(schema.vendorUsers.vendorId, vendorId),
      }),
      'VendorsRepository.isUserLinked',
    );
    if (error) throw error;
    return !!row;
  }

  // ── Role helpers ──────────────────────────────────────────────────────────

  async assignVendorOwnerRole(userId: string): Promise<void> {
    const { data: role, error: roleError } = await tryCatch(
      this.db.query.roles.findFirst({
        where: eq(schema.roles.code, UserRole.VENDOR_OWNER),
      }),
      'VendorsRepository.assignVendorOwnerRole.findRole',
    );
    if (roleError) throw roleError;
    if (!role) return;

    const { error } = await tryCatch(
      this.db.insert(schema.userRoles).values({ userId, roleId: role.id }).onConflictDoNothing(),
      'VendorsRepository.assignVendorOwnerRole.insertRole',
    );
    if (error) throw error;
  }
}
