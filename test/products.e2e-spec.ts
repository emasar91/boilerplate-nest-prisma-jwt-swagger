import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';

import { AppModule } from '../src/app.module';
import { PrismaService } from '@/database/infrastructure/prisma/prisma.service';

interface LoginResponse {
  accessToken: string;
  user: { userId: string; email: string };
}

interface ProductsListResponse {
  data: unknown[];
  total: number;
}

describe('ProductsController (E2E)', () => {
  let app: INestApplication;
  let httpServer: App;
  let prisma: PrismaService;
  let authToken: string; // 🔒 Guardaremos la llave maestra aquí para los endpoints privados

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // 🌍 Replicamos exactamente la configuración del main.ts para que las rutas coincidan
    app.setGlobalPrefix('api');
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

    await app.init();

    httpServer = app.getHttpServer() as App;
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // 🔑 OBTENER EL TOKEN: Logueamos usando las credenciales simuladas en tu JwtAuthAdapter
    const loginResponse = await request(httpServer)
      .post('/api/v1/auth/login')
      .send({
        email: 'emanuel@test.com',
        password: '123456',
      })
      .expect(200);

    const body = loginResponse.body as LoginResponse;
    authToken = body.accessToken; // Guardamos el token para usarlo después
  });

  beforeEach(async () => {
    await prisma.product.deleteMany();
  });

  afterAll(async () => {
    await prisma.product.deleteMany();
    await app.close();
  });

  describe('GET /api/v1/products', () => {
    it('should return an empty list if there are no products (Público)', async () => {
      // 🔓 Este endpoint es público (@Public), no hace falta mandar el token
      const response = await request(httpServer)
        .get('/api/v1/products?limit=5&offset=0')
        .expect(200);

      const body = response.body as ProductsListResponse;

      expect(body.data).toEqual([]);
      expect(body.total).toBe(0);
    });
  });

  describe('POST /api/v1/products', () => {
    it('should return 401 if token is not provided (Privado)', async () => {
      // 🔥 Test de control: Verificamos que nuestro Guard global funcione de verdad rebotando sin token
      await request(httpServer)
        .post('/api/v1/products')
        .send({ name: 'Fallo Seguro', price: 10, stock: 1 })
        .expect(401);
    });

    it('should create a product successfully when authenticated (Privado)', async () => {
      const payload = {
        name: 'Teclado HyperX Alloy',
        price: 99.99,
        stock: 15,
      };

      // 🔒 Mandamos el token en el header usando .set()
      await request(httpServer)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${authToken}`) // 👈 Inyección del Bearer Token
        .send(payload)
        .expect(201);
    });
  });

  describe('GET /api/v1/products/:id', () => {
    it('should return 200 for an existing product (Público)', async () => {
      const localProduct = await prisma.product.create({
        data: {
          name: 'Monitor LG 24',
          price: 180,
          stock: 5,
        },
      });

      // 🔓 Es público por tu decorador @Public()
      const response = await request(httpServer)
        .get(`/api/v1/products/${localProduct.id}`)
        .expect(200);

      const body = response.body as { name: string };
      expect(body.name).toBe('Monitor LG 24');
    });
  });
});
