import { PaginatedData } from '@/common/interfaces/paginated-data.interface';
import { Product } from '@/products/domain/entities/product.entity';

export abstract class ProductRepository {
  abstract create(product: Partial<Product>): Promise<Product>;

  abstract findAll(
    limit: number,
    offset: number,
  ): Promise<PaginatedData<Product>>;

  abstract findById(id: string): Promise<Product | null>;

  abstract update(id: string, product: Partial<Product>): Promise<Product>;

  abstract remove(id: string): Promise<Product>;
}
