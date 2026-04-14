import { Injectable }     from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, isNull }     from 'drizzle-orm';
import * as schema        from '../../../database/schema';
import { InjectDatabase } from '../../../database/database.decorator';

@Injectable()
export class CategoriesRepository {
  constructor(@InjectDatabase() private readonly db: NodePgDatabase<typeof schema>) {}

  async findAll() {
    return this.db.query.categories.findMany({
      orderBy: (cats, { asc }) => [asc(cats.level), asc(cats.name)],
    });
  }

  async findRoots() {
    return this.db.query.categories.findMany({
      where: isNull(schema.categories.parentId),
      orderBy: (cats, { asc }) => [asc(cats.name)],
    });
  }

  async findBySlug(slug: string) {
    return this.db.query.categories.findFirst({
      where: eq(schema.categories.slug, slug),
    });
  }

  async findChildren(parentId: string) {
    return this.db.query.categories.findMany({
      where: eq(schema.categories.parentId, parentId),
      orderBy: (cats, { asc }) => [asc(cats.name)],
    });
  }
}
