import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/infrastructure/prisma/prisma.service';
import { Product } from '@/products/domain/entities/product.entity';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { PaginatedData } from '@/common/interfaces/paginated-data.interface';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  // 💡 Inyectamos nuestro PrismaService avanzado con el Native PG Adapter
  constructor(private readonly prisma: PrismaService) {}

  async create(product: Partial<Product>): Promise<Product> {
    return this.prisma.product.create({
      data: {
        name: product.name!,
        price: product.price!,
        stock: product.stock,
        description: product.description,
      },
    });
  }

  async findAll(
    limit: number,
    offset: number,
  ): Promise<PaginatedData<Product>> {
    const where = { isActive: true };

    const data = await this.prisma.product.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.product.count({ where });

    return { data, total, limit, offset };
  }

  async findById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id, isActive: true },
    });
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    // Validamos primero que exista antes de intentar actualizar
    await this.getExistingProduct(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description,
        isActive: product.isActive,
      },
    });
  }

  async remove(id: string): Promise<Product> {
    await this.getExistingProduct(id);

    // Aplicamos un Soft Delete (Borrado lógico) para cuidar la integridad de los datos
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // 🛠️ Método privado utilitario para reutilizar la lógica de chequeo de existencia
  private async getExistingProduct(id: string): Promise<void> {
    const exists = await this.prisma.product.findUnique({
      where: { id, isActive: true },
    });
    if (!exists) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
  }
}
