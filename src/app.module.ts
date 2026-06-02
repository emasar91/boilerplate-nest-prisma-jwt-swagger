import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { ProductsModule } from './products/products.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/infrastructure/guards/jwt-auth.guard';
import { AuthModule } from './auth/infrastructure/auth.module';
import { DataBaseModule } from './database/infrastructure/database.module';

@Module({
  imports: [AppConfigModule, DataBaseModule, ProductsModule, AuthModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // 🔒 Ahora toda la app requiere JWT por defecto
    },
  ],
})
export class AppModule {}
