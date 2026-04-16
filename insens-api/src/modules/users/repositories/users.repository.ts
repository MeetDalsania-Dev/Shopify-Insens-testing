import { Injectable } from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../../../database/schema';
import { InjectDatabase } from '../../../database/database.decorator';
import { tryCatch } from '../../../common/helpers/try-catch.helper';  // adjust path

@Injectable()
export class UsersRepository {
  constructor(@InjectDatabase() private readonly db: NodePgDatabase<typeof schema>) {}

  async findById(id: string) {
    const { data, error } = await tryCatch(
      this.db.query.users.findFirst({ where: eq(schema.users.id, id) }),
      'UsersRepository.findById',
    );
    if (error) throw error;
    return data;
  }

  async findByEmail(email: string) {
    const { data, error } = await tryCatch(
      this.db.query.users.findFirst({ where: eq(schema.users.email, email) }),
      'UsersRepository.findByEmail',
    );
    if (error) throw error;
    return data;
  }

  async update(id: string, data: Partial<schema.NewUser>) {
    const { data: rows, error } = await tryCatch(
      this.db
        .update(schema.users)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(schema.users.id, id))
        .returning(),
      'UsersRepository.update',
    );
    if (error) throw error;
    return rows[0];
  }

  async softDelete(id: string) {
    const { error } = await tryCatch(
      this.db
        .update(schema.users)
        .set({ status: 'deleted', updatedAt: new Date() })
        .where(eq(schema.users.id, id)),
      'UsersRepository.softDelete',
    );
    if (error) throw error;
  }
}
