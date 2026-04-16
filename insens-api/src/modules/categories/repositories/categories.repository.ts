import { Injectable } from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, isNull } from 'drizzle-orm';
import * as schema from '../../../database/schema';
import { InjectDatabase } from '../../../database/database.decorator';
import { tryCatch } from '../../../common/helpers/try-catch.helper';  // adjust path

@Injectable()
export class CategoriesRepository {
  constructor(@InjectDatabase() private readonly db: NodePgDatabase<typeof schema>) {}

  async findAll() {
    const { data, error } = await tryCatch(
      this.db.query.categories.findMany({
        orderBy: (cats, { asc }) => [asc(cats.level), asc(cats.name)],
      }),
      'CategoriesRepository.findAll',
    );
    if (error) throw error;
    return data;
  }

  async findRoots() {
    const { data, error } = await tryCatch(
      this.db.query.categories.findMany({
        where: isNull(schema.categories.parentId),
        orderBy: (cats, { asc }) => [asc(cats.name)],
      }),
      'CategoriesRepository.findRoots',
    );
    if (error) throw error;
    return data;
  }

  async findBySlug(slug: string) {
    const { data, error } = await tryCatch(
      this.db.query.categories.findFirst({
        where: eq(schema.categories.slug, slug),
      }),
      'CategoriesRepository.findBySlug',
    );
    if (error) throw error;
    return data;
  }

  async findChildren(parentId: string) {
    const { data, error } = await tryCatch(
      this.db.query.categories.findMany({
        where: eq(schema.categories.parentId, parentId),
        orderBy: (cats, { asc }) => [asc(cats.name)],
      }),
      'CategoriesRepository.findChildren',
    );
    if (error) throw error;
    return data;
  }
}
