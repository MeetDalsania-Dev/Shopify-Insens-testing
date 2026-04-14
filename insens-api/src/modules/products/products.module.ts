import { Module, forwardRef } from '@nestjs/common';
import { ProductsController }  from './controllers/products.controller';
import { ProductsService }     from './services/products.service';
import { ProductsRepository }  from './repositories/products.repository';
import { ShopsModule }         from '../shops/shops.module';
import { DatabaseModule }      from '../../database/database.module';

@Module({
  imports:     [DatabaseModule, forwardRef(() => ShopsModule)],
  controllers: [ProductsController],
  providers:   [ProductsService, ProductsRepository],
  exports:     [ProductsService, ProductsRepository],
})
export class ProductsModule {}
