import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags }           from '@nestjs/swagger';
import { CategoriesService } from '../services/categories.service';
import { Public }            from '../../../core/decorators/public.decorator';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Public()
  listCategories() {
    return this.categoriesService.listCategories();
  }

  @Get(':slug')
  @Public()
  getCategory(@Param('slug') slug: string) {
    return this.categoriesService.getCategoryBySlug(slug);
  }
}
