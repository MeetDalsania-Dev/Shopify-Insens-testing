import { Controller, Get } from '@nestjs/common';
import { ApiTags }           from '@nestjs/swagger';
import { CategoriesService } from '../services/categories.service';
import { Public }            from '../../../core/decorators/public.decorator';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  listCategories() {
    return this.categoriesService.listCategories();
  }
}
