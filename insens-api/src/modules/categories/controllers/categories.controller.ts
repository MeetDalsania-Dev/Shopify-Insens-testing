import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from '../services/categories.service';
import { Public }            from '../../../core/decorators/public.decorator';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List all categories (public)', description: 'Returns flat list; use parentId to reconstruct the tree.' })
  @ApiResponse({ status: 200, description: 'List of categories with id, name, slug, level, parentId' })
  listCategories() {
    return this.categoriesService.listCategories();
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Get category by slug with its children (public)' })
  @ApiParam({ name: 'slug', description: 'Category URL slug', example: 'woody' })
  @ApiResponse({ status: 200, description: 'Category details with children array' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  getCategory(@Param('slug') slug: string) {
    return this.categoriesService.getCategoryBySlug(slug);
  }
}
