import { Injectable } from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and, gt } from 'drizzle-orm';
import * as schema from '../../../database/schema';
import { InjectDatabase } from '../../../database/database.decorator';
import { tryCatch } from '../../../common/helpers/try-catch.helper';  // adjust path

@Injectable()
export class AuthRepository {
  constructor(@InjectDatabase() private readonly db: NodePgDatabase<typeof schema>) {}

  // ── Users ─────────────────────────────────────────────────────────────────

  async findUserByEmail(email: string) {
    const { data, error } = await tryCatch(
      this.db.query.users.findFirst({ where: eq(schema.users.email, email) }),
      'AuthRepository.findUserByEmail',
    );
    if (error) throw error;
    return data;
  }

  async findUserById(id: string) {
    const { data, error } = await tryCatch(
      this.db.query.users.findFirst({ where: eq(schema.users.id, id) }),
      'AuthRepository.findUserById',
    );
    if (error) throw error;
    return data;
  }

  async createUser(data: schema.NewUser) {
    const { data: rows, error } = await tryCatch(
      this.db.insert(schema.users).values(data).returning(),
      'AuthRepository.createUser',
    );
    if (error) throw error;
    return rows[0];
  }

  async updateLastLogin(userId: string) {
    const { error } = await tryCatch(
      this.db
        .update(schema.users)
        .set({ lastLoginAt: new Date(), updatedAt: new Date() })
        .where(eq(schema.users.id, userId)),
      'AuthRepository.updateLastLogin',
    );
    if (error) throw error;
  }

  // ── Profiles ──────────────────────────────────────────────────────────────

  async createProfile(data: {
    userId: string;
    firstName?: string | null;
    lastName?: string | null;
  }) {
    const { error } = await tryCatch(
      this.db
        .insert(schema.userProfiles)
        .values({
          userId: data.userId,
          firstName: data.firstName ?? null,
          lastName: data.lastName ?? null,
          displayName: [data.firstName, data.lastName].filter(Boolean).join(' ') || null,
        })
        .onConflictDoNothing(),
      'AuthRepository.createProfile',
    );
    if (error) throw error;
  }

  async findProfile(userId: string) {
    const { data, error } = await tryCatch(
      this.db.query.userProfiles.findFirst({ where: eq(schema.userProfiles.userId, userId) }),
      'AuthRepository.findProfile',
    );
    if (error) throw error;
    return data;
  }

  // ── Roles ─────────────────────────────────────────────────────────────────

  async findRoleByCode(code: string) {
    const { data, error } = await tryCatch(
      this.db.query.roles.findFirst({ where: eq(schema.roles.code, code) }),
      'AuthRepository.findRoleByCode',
    );
    if (error) throw error;
    return data;
  }

  async assignRole(userId: string, roleId: number) {
    const { error } = await tryCatch(
      this.db.insert(schema.userRoles).values({ userId, roleId }).onConflictDoNothing(),
      'AuthRepository.assignRole',
    );
    if (error) throw error;
  }

  async getUserRoleCodes(userId: string): Promise<string[]> {
    const { data: rows, error } = await tryCatch(
      this.db
        .select({ code: schema.roles.code })
        .from(schema.userRoles)
        .innerJoin(schema.roles, eq(schema.userRoles.roleId, schema.roles.id))
        .where(eq(schema.userRoles.userId, userId)),
      'AuthRepository.getUserRoleCodes',
    );
    if (error) throw error;
    return rows.map((r) => r.code);
  }

  // ── Vendor Link ───────────────────────────────────────────────────────────

  async getVendorIdForUser(userId: string): Promise<string | null> {
    const { data: row, error } = await tryCatch(
      this.db.query.vendorUsers.findFirst({
        where: eq(schema.vendorUsers.userId, userId),
      }),
      'AuthRepository.getVendorIdForUser',
    );
    if (error) throw error;
    return row?.vendorId ?? null;
  }

  // ── Refresh Tokens ────────────────────────────────────────────────────────

  async createRefreshToken(data: schema.NewRefreshToken) {
    const { data: rows, error } = await tryCatch(
      this.db.insert(schema.refreshTokens).values(data).returning(),
      'AuthRepository.createRefreshToken',
    );
    if (error) throw error;
    return rows[0];
  }

  async findRefreshToken(userId: string, tokenHash: string) {
    const { data, error } = await tryCatch(
      this.db.query.refreshTokens.findFirst({
        where: and(
          eq(schema.refreshTokens.userId, userId),
          eq(schema.refreshTokens.tokenHash, tokenHash),
          gt(schema.refreshTokens.expiresAt, new Date()),
        ),
      }),
      'AuthRepository.findRefreshToken',
    );
    if (error) throw error;
    return data;
  }

  async deleteRefreshToken(id: string) {
    const { error } = await tryCatch(
      this.db.delete(schema.refreshTokens).where(eq(schema.refreshTokens.id, id)),
      'AuthRepository.deleteRefreshToken',
    );
    if (error) throw error;
  }

  async deleteAllRefreshTokensForUser(userId: string) {
    const { error } = await tryCatch(
      this.db.delete(schema.refreshTokens).where(eq(schema.refreshTokens.userId, userId)),
      'AuthRepository.deleteAllRefreshTokensForUser',
    );
    if (error) throw error;
  }
}
