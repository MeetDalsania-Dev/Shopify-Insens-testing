import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../repositories/categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepo: CategoriesRepository) {}

  listCategories() {
    return this.categoriesRepo.findAll();
  }
}
