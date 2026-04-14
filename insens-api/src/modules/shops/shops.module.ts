import { Module, forwardRef } from '@nestjs/common';
import { ShopsController }    from './controllers/shops.controller';
import { ShopsService }       from './services/shops.service';
import { ShopsRepository }    from './repositories/shops.repository';
import { DatabaseModule }     from '../../database/database.module';
import { ProductsModule }     from '../products/products.module';

@Module({
  imports:     [DatabaseModule, forwardRef(() => ProductsModule)],
  controllers: [ShopsController],
  providers:   [ShopsService, ShopsRepository],
  exports:     [ShopsService, ShopsRepository],
})
export class ShopsModule {}
