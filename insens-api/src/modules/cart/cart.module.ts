import { Module }        from '@nestjs/common';
import { CartController } from './controllers/cart.controller';

/** Stub module — full implementation in future milestone */
@Module({
  controllers: [CartController],
})
export class CartModule {}
