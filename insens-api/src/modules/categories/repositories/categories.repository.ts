import { Injectable } from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema        from '../../../database/schema';
import { InjectDatabase } from '../../../database/database.decorator';

@Injectable()
export class CategoriesRepository {
  constructor(@InjectDatabase() private readonly db: NodePgDatabase<typeof schema>) {}

  async findAll() {
    return this.db.query.categories.findMany({
      orderBy: (cats, { asc }) => [asc(cats.name)],
    });
  }
}
