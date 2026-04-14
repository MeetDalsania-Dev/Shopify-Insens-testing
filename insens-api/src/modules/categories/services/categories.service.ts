import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from '../repositories/categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepo: CategoriesRepository) {}

  async listCategories() {
    return this.categoriesRepo.findAll();
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.categoriesRepo.findBySlug(slug);
    if (!category) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Category not found' });
    }

    const children = await this.categoriesRepo.findChildren(category.id);

    return { ...category, children };
  }
}
