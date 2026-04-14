import { Module }       from '@nestjs/common';
import { ConfigModule }  from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

// Config
import appConfig      from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig      from './config/jwt.config';
import cacheConfig    from './config/cache.config';

// Core
import { HttpExceptionFilter }  from './core/filters/http-exception.filter';
import { JwtAuthGuard }         from './core/guards/jwt-auth.guard';
import { ResponseInterceptor }  from './core/interceptors/response.interceptor';

// Database
import { DatabaseModule } from './database/database.module';

// Feature modules
import { AuthModule }       from './modules/auth/auth.module';
import { UsersModule }      from './modules/users/users.module';
import { VendorsModule }    from './modules/vendors/vendors.module';
import { ProductsModule }   from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { AdminModule }      from './modules/admin/admin.module';
import { CustomersModule }  from './modules/customers/customers.module';
import { CartModule }       from './modules/cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load:     [appConfig, databaseConfig, jwtConfig, cacheConfig],
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    VendorsModule,
    ProductsModule,
    CategoriesModule,
    AdminModule,
    CustomersModule,
    CartModule,
  ],
  providers: [
    // Global exception filter — consistent error envelope
    { provide: APP_FILTER,      useClass: HttpExceptionFilter },
    // Global JWT guard — protect all routes unless @Public() is set
    { provide: APP_GUARD,       useClass: JwtAuthGuard },
    // Global response interceptor — wrap all successful responses
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}
