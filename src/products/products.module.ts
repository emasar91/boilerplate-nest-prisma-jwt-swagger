import { Module } from '@nestjs/common';
import { ProductRepository } from './domain/repositories/product.repository';
import { ProductsController } from './infrastructure/controllers/products.controller';
import { ProductsService } from './aplication/products.service';
import { PrismaProductRepository } from './infrastructure/repositories/prisma-product.repository';
import { DataBaseModule } from '@/database/infrastructure/database.module';

@Module({
  imports: [
    DataBaseModule, // Le da acceso al PrismaProductRepository para usar el PrismaService
  ],
  controllers: [
    ProductsController, // Expone los endpoints HTTP
  ],
  providers: [
    ProductsService, // Registra la capa de aplicación

    // 🔌 LA MAGIA DEL CABLEADO:
    {
      provide: ProductRepository, // Cuando se busque el token del contrato...
      useClass: PrismaProductRepository, // NestJS va a instanciar la persistencia de Prisma.
    },
  ],
  // Exportamos el servicio por si otros módulos del sistema necesitan interactuar con productos
  exports: [ProductsService],
})
export class ProductsModule {}
