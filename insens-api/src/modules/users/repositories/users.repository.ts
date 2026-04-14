import { Injectable } from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq }            from 'drizzle-orm';
import * as schema       from '../../../database/schema';
import { InjectDatabase } from '../../../database/database.decorator';

@Injectable()
export class UsersRepository {
  constructor(@InjectDatabase() private readonly db: NodePgDatabase<typeof schema>) {}

  async findById(id: string) {
    return this.db.query.users.findFirst({ where: eq(schema.users.id, id) });
  }

  async findByEmail(email: string) {
    return this.db.query.users.findFirst({ where: eq(schema.users.email, email) });
  }

  async update(id: string, data: Partial<schema.NewUser>) {
    const [user] = await this.db
      .update(schema.users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();
    return user;
  }

  async softDelete(id: string) {
    await this.db
      .update(schema.users)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(schema.users.id, id));
  }
}
