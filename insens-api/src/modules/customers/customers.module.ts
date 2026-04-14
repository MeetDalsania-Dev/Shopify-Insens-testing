import { Module }               from '@nestjs/common';
import { CustomersController }  from './controllers/customers.controller';

/** Stub module — full implementation in future milestone */
@Module({
  controllers: [CustomersController],
})
export class CustomersModule {}
