import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { Product } from '@/products/domain/entities/product.entity';
import { PaginatedData } from '@/common/interfaces/paginated-data.interface';

@Injectable()
export class ProductsService {
  // 💡 Inyectamos el contrato del repositorio de Dominio, no la implementación de Prisma
  constructor(private readonly productRepository: ProductRepository) {}

  async create(productData: Partial<Product>): Promise<Product> {
    // Aquí iría lógica de negocio específica de la aplicación si fuera necesaria
    return this.productRepository.create(productData);
  }

  async findAll(
    limit: number,
    offset: number,
  ): Promise<PaginatedData<Product>> {
    return this.productRepository.findAll(limit, offset);
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async update(id: string, productData: Partial<Product>): Promise<Product> {
    // El repositorio se encarga de verificar la existencia internamente o podemos hacerlo acá
    return this.productRepository.update(id, productData);
  }

  async remove(id: string): Promise<Product> {
    return this.productRepository.remove(id);
  }
}
