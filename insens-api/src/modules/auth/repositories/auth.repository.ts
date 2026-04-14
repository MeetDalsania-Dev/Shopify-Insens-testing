import { Injectable }     from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and, gt }   from 'drizzle-orm';
import * as schema        from '../../../database/schema';
import { InjectDatabase } from '../../../database/database.decorator';

@Injectable()
export class AuthRepository {
  constructor(@InjectDatabase() private readonly db: NodePgDatabase<typeof schema>) {}

  // ── Users ────────────────────────────────────────────────────────────────

  async findUserByEmail(email: string) {
    return this.db.query.users.findFirst({ where: eq(schema.users.email, email) });
  }

  async findUserById(id: string) {
    return this.db.query.users.findFirst({ where: eq(schema.users.id, id) });
  }

  async createUser(data: schema.NewUser) {
    const [user] = await this.db.insert(schema.users).values(data).returning();
    return user;
  }

  async updateLastLogin(userId: string) {
    await this.db
      .update(schema.users)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(schema.users.id, userId));
  }

  // ── Profiles ─────────────────────────────────────────────────────────────

  async createProfile(data: { userId: string; firstName?: string | null; lastName?: string | null }) {
    await this.db
      .insert(schema.userProfiles)
      .values({
        userId:      data.userId,
        firstName:   data.firstName ?? null,
        lastName:    data.lastName  ?? null,
        displayName: [data.firstName, data.lastName].filter(Boolean).join(' ') || null,
      })
      .onConflictDoNothing();
  }

  async findProfile(userId: string) {
    return this.db.query.userProfiles.findFirst({ where: eq(schema.userProfiles.userId, userId) });
  }

  // ── Roles ────────────────────────────────────────────────────────────────

  async findRoleByCode(code: string) {
    return this.db.query.roles.findFirst({ where: eq(schema.roles.code, code) });
  }

  async assignRole(userId: string, roleId: number) {
    await this.db
      .insert(schema.userRoles)
      .values({ userId, roleId })
      .onConflictDoNothing();
  }

  async getUserRoleCodes(userId: string): Promise<string[]> {
    const rows = await this.db
      .select({ code: schema.roles.code })
      .from(schema.userRoles)
      .innerJoin(schema.roles, eq(schema.userRoles.roleId, schema.roles.id))
      .where(eq(schema.userRoles.userId, userId));

    return rows.map((r) => r.code);
  }

  // ── Vendor link ───────────────────────────────────────────────────────────

  async getVendorIdForUser(userId: string): Promise<string | null> {
    const row = await this.db.query.vendorUsers.findFirst({
      where: eq(schema.vendorUsers.userId, userId),
    });
    return row?.vendorId ?? null;
  }

  // ── Refresh Tokens ────────────────────────────────────────────────────────

  async createRefreshToken(data: schema.NewRefreshToken) {
    const [token] = await this.db.insert(schema.refreshTokens).values(data).returning();
    return token;
  }

  async findRefreshToken(userId: string, tokenHash: string) {
    return this.db.query.refreshTokens.findFirst({
      where: and(
        eq(schema.refreshTokens.userId,    userId),
        eq(schema.refreshTokens.tokenHash, tokenHash),
        gt(schema.refreshTokens.expiresAt, new Date()),
      ),
    });
  }

  async deleteRefreshToken(id: string) {
    await this.db.delete(schema.refreshTokens).where(eq(schema.refreshTokens.id, id));
  }

  async deleteAllRefreshTokensForUser(userId: string) {
    await this.db
      .delete(schema.refreshTokens)
      .where(eq(schema.refreshTokens.userId, userId));
  }
}
