import { Injectable } from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and, gt }   from 'drizzle-orm';
import * as schema        from '../../../database/schema';
import { InjectDatabase } from '../../../database/database.decorator';

@Injectable()
export class AuthRepository {
  constructor(@InjectDatabase() private readonly db: NodePgDatabase<typeof schema>) {}

  // ── Users ───────────────────────────────────────────────────────────────

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

  // ── Refresh Tokens ──────────────────────────────────────────────────────

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
