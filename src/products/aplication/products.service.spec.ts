import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { Product } from '@/products/domain/entities/product.entity';

describe('ProductsService (Unit Test)', () => {
  let service: ProductsService;
  let repository: ProductRepository;

  // 1. Creamos un mock de datos para simular lo que devolvería la base de datos
  const mockProduct: Product = {
    id: 'a3bf9291-7f92-4d83-9b43-982c5a3d0cb2',
    name: 'Teclado Mecánico de Prueba',
    price: 100,
    stock: 10,
    isActive: true,
    description: 'Descripción de prueba',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // 2. Creamos el Mock Factory del Repositorio cumpliendo con el contrato del Dominio
  const mockProductRepository = {
    create: jest.fn().mockResolvedValue(mockProduct),
    findAll: jest.fn().mockResolvedValue({
      data: [mockProduct],
      total: 1,
      limit: 10,
      offset: 0,
    }),
    findById: jest.fn(),
    update: jest.fn().mockResolvedValue(mockProduct),
    remove: jest.fn().mockResolvedValue({ ...mockProduct, isActive: false }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        // 🔌 En lugar de usar PrismaProductRepository, le pasamos nuestro Mock en memoria
        {
          provide: ProductRepository,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<ProductRepository>(ProductRepository);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpiamos el historial de ejecuciones entre tests
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a product if found', async () => {
      // 💡 Guardamos el spy de Jest en una constante
      const findByIdSpy = jest
        .spyOn(repository, 'findById')
        .mockResolvedValue(mockProduct);

      const result = await service.findOne(mockProduct.id);

      expect(result).toEqual(mockProduct);

      // ✅ Evaluamos directamente el spy. Chau error de 'unbound-method'
      expect(findByIdSpy).toHaveBeenCalledWith(mockProduct.id);
    });

    it('should throw a NotFoundException if product does not exist', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(null);

      await expect(service.findOne('id-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create and return a new product', async () => {
      const dto = { name: 'Teclado Mecánico de Prueba', price: 100, stock: 10 };

      const createSpy = jest
        .spyOn(repository, 'create')
        .mockResolvedValue(mockProduct);
      const result = await service.create(dto);

      expect(result).toEqual(mockProduct);

      // ✅ Evaluamos el spy de forma segura para el linter
      expect(createSpy).toHaveBeenCalledWith(dto);
    });
  });
});
