import { Injectable } from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, sql, and } from 'drizzle-orm';
import * as schema from '../../../database/schema';
import { InjectDatabase } from '../../../database/database.decorator';
import { tryCatch } from '../../../common/helpers/try-catch.helper';  // adjust path

export interface AdminVendorFilters {
  status?: string;
  approvalStatus?: string;
  page?: number;
  limit?: number;
}

export interface AdminUserFilters {
  page?: number;
  limit?: number;
}

@Injectable()
export class AdminRepository {
  constructor(@InjectDatabase() private readonly db: NodePgDatabase<typeof schema>) {}

  // ── Stats ─────────────────────────────────────────────────────────────────

  async getStats() {
    const { data: results, error } = await tryCatch(
      Promise.all([
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
      ]),
      'AdminRepository.getStats',
    );
    if (error) throw error;

    const [
      totalUsersRes,
      pendingVendorsRes,
      activeVendorsRes,
      suspendedVendorsRes,
      totalProductsRes,
    ] = results;

    return {
      totalUsers: totalUsersRes[0].count,
      totalVendors:
        pendingVendorsRes[0].count + activeVendorsRes[0].count + suspendedVendorsRes[0].count,
      totalPendingVendors: pendingVendorsRes[0].count,
      totalActiveVendors: activeVendorsRes[0].count,
      totalSuspendedVendors: suspendedVendorsRes[0].count,
      totalProducts: totalProductsRes[0].count,
    };
  }

  // ── Vendors ───────────────────────────────────────────────────────────────

  async findAllVendors(filters: AdminVendorFilters) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const offset = (page - 1) * limit;

    const conditions: ReturnType<typeof eq>[] = [];
    if (filters.approvalStatus) {
      conditions.push(eq(schema.vendors.approvalStatus, filters.approvalStatus as any));
    } else if (filters.status) {
      conditions.push(eq(schema.vendors.status, filters.status as any));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const ownerJoinCondition = and(
      eq(schema.vendorUsers.vendorId, schema.vendors.id),
      eq(schema.vendorUsers.role, 'owner'),
    );

    const { data: results, error } = await tryCatch(
      Promise.all([
        this.db
          .select({
            id: schema.vendors.id,
            slug: schema.vendors.slug,
            legalName: schema.vendors.legalName,
            displayName: schema.vendors.displayName,
            email: schema.vendors.email,
            phone: schema.vendors.phone,
            status: schema.vendors.status,
            approvalStatus: schema.vendors.approvalStatus,
            logoUrl: schema.vendors.logoUrl,
            description: schema.vendors.description,
            createdAt: schema.vendors.createdAt,
            approvedAt: schema.vendors.approvedAt,
            suspendedAt: schema.vendors.suspendedAt,
            updatedAt: schema.vendors.updatedAt,
            ownerId: schema.users.id,
            ownerEmail: schema.users.email,
            ownerCreatedAt: schema.users.createdAt,
            ownerFirstName: schema.userProfiles.firstName,
            ownerLastName: schema.userProfiles.lastName,
          })
          .from(schema.vendors)
          .leftJoin(schema.vendorUsers, ownerJoinCondition)
          .leftJoin(schema.users, eq(schema.users.id, schema.vendorUsers.userId))
          .leftJoin(schema.userProfiles, eq(schema.userProfiles.userId, schema.vendorUsers.userId))
          .where(whereClause)
          .orderBy(schema.vendors.createdAt)
          .limit(limit)
          .offset(offset),
        this.db
          .select({ count: sql<number>`count(*)::int` })
          .from(schema.vendors)
          .where(whereClause),
      ]),
      'AdminRepository.findAllVendors',
    );
    if (error) throw error;

    const [rows, [{ count }]] = results;

    const items = rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      legalName: r.legalName,
      displayName: r.displayName,
      email: r.email,
      phone: r.phone,
      status: r.status,
      approvalStatus: r.approvalStatus,
      logoUrl: r.logoUrl,
      description: r.description,
      createdAt: r.createdAt,
      approvedAt: r.approvedAt,
      suspendedAt: r.suspendedAt,
      updatedAt: r.updatedAt,
      owner: r.ownerId
        ? {
            id: r.ownerId,
            email: r.ownerEmail,
            firstName: r.ownerFirstName ?? null,
            lastName: r.ownerLastName ?? null,
            createdAt: r.ownerCreatedAt,
          }
        : null,
    }));

    return { items, total: count, page, limit };
  }

  async findVendorById(id: string) {
    const ownerJoinCondition = and(
      eq(schema.vendorUsers.vendorId, schema.vendors.id),
      eq(schema.vendorUsers.role, 'owner'),
    );

    const { data: rows, error } = await tryCatch(
      this.db
        .select({
          id: schema.vendors.id,
          slug: schema.vendors.slug,
          legalName: schema.vendors.legalName,
          displayName: schema.vendors.displayName,
          email: schema.vendors.email,
          phone: schema.vendors.phone,
          status: schema.vendors.status,
          approvalStatus: schema.vendors.approvalStatus,
          logoUrl: schema.vendors.logoUrl,
          bannerUrl: schema.vendors.bannerUrl,
          description: schema.vendors.description,
          businessType: schema.vendors.businessType,
          createdAt: schema.vendors.createdAt,
          approvedAt: schema.vendors.approvedAt,
          suspendedAt: schema.vendors.suspendedAt,
          updatedAt: schema.vendors.updatedAt,
          ownerId: schema.users.id,
          ownerEmail: schema.users.email,
          ownerCreatedAt: schema.users.createdAt,
          ownerFirstName: schema.userProfiles.firstName,
          ownerLastName: schema.userProfiles.lastName,
        })
        .from(schema.vendors)
        .leftJoin(schema.vendorUsers, ownerJoinCondition)
        .leftJoin(schema.users, eq(schema.users.id, schema.vendorUsers.userId))
        .leftJoin(schema.userProfiles, eq(schema.userProfiles.userId, schema.vendorUsers.userId))
        .where(eq(schema.vendors.id, id))
        .limit(1),
      'AdminRepository.findVendorById',
    );
    if (error) throw error;
    if (!rows.length) return null;

    const r = rows[0];
    return {
      id: r.id,
      slug: r.slug,
      legalName: r.legalName,
      displayName: r.displayName,
      email: r.email,
      phone: r.phone,
      status: r.status,
      approvalStatus: r.approvalStatus,
      logoUrl: r.logoUrl,
      bannerUrl: r.bannerUrl,
      description: r.description,
      businessType: r.businessType,
      createdAt: r.createdAt,
      approvedAt: r.approvedAt,
      suspendedAt: r.suspendedAt,
      updatedAt: r.updatedAt,
      owner: r.ownerId
        ? {
            id: r.ownerId,
            email: r.ownerEmail,
            firstName: r.ownerFirstName ?? null,
            lastName: r.ownerLastName ?? null,
            createdAt: r.ownerCreatedAt,
          }
        : null,
    };
  }

  async updateVendor(id: string, data: Partial<schema.NewVendor>) {
    const { data: rows, error } = await tryCatch(
      this.db
        .update(schema.vendors)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(schema.vendors.id, id))
        .returning(),
      'AdminRepository.updateVendor',
    );
    if (error) throw error;
    return rows[0];
  }

  // ── Users ─────────────────────────────────────────────────────────────────

  async findAllUsers(filters: AdminUserFilters) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const offset = (page - 1) * limit;

    const { data: results, error } = await tryCatch(
      Promise.all([
        this.db
          .select({
            id: schema.users.id,
            email: schema.users.email,
            status: schema.users.status,
            authProvider: schema.users.authProvider,
            isEmailVerified: schema.users.isEmailVerified,
            createdAt: schema.users.createdAt,
          })
          .from(schema.users)
          .limit(limit)
          .offset(offset),
        this.db.select({ count: sql<number>`count(*)::int` }).from(schema.users),
      ]),
      'AdminRepository.findAllUsers',
    );
    if (error) throw error;

    const [items, [{ count }]] = results;
    return { items, total: count, page, limit };
  }

  async findUserById(id: string) {
    const { data: rows, error } = await tryCatch(
      this.db
        .select({
          id: schema.users.id,
          email: schema.users.email,
          status: schema.users.status,
          authProvider: schema.users.authProvider,
          isEmailVerified: schema.users.isEmailVerified,
          createdAt: schema.users.createdAt,
        })
        .from(schema.users)
        .where(eq(schema.users.id, id)),
      'AdminRepository.findUserById',
    );
    if (error) throw error;
    return rows[0] ?? null;
  }

  async suspendUser(id: string) {
    const { data: rows, error } = await tryCatch(
      this.db
        .update(schema.users)
        .set({ status: 'suspended', updatedAt: new Date() })
        .where(eq(schema.users.id, id))
        .returning({
          id: schema.users.id,
          email: schema.users.email,
          status: schema.users.status,
        }),
      'AdminRepository.suspendUser',
    );
    if (error) throw error;
    return rows[0];
  }
}
