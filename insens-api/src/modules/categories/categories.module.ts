import { Module }                from '@nestjs/common';
import { CategoriesController }  from './controllers/categories.controller';
import { CategoriesService }     from './services/categories.service';
import { CategoriesRepository }  from './repositories/categories.repository';
import { DatabaseModule }        from '../../database/database.module';

@Module({
  imports:     [DatabaseModule],
  controllers: [CategoriesController],
  providers:   [CategoriesService, CategoriesRepository],
  exports:     [CategoriesService],
})
export class CategoriesModule {}
