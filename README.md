# NestJS Enterprise Boilerplate (Clean Architecture)

Este es un template base (boilerplate) diseñado bajo los principios de **Clean Architecture** (Arquitectura Hexagonal) utilizando **NestJS**, **TypeScript** y **Prisma ORM**. El objetivo principal de esta plantilla es proporcionar un entorno desacoplado, con tipado estricto (sin escapes con `any`), seguridad global automatizada y documentación autogenerada y semántica.

---

## ⬢ Arquitectura del Sistema y Árbol de Carpetas

La estructura del proyecto sigue estrictamente el patrón de **Puertos y Adaptadores**. La lógica de negocio central (Dominio y Aplicación) se mantiene completamente aislada de los detalles técnicos del exterior (framework, ORM, base de datos).

Basado en la estructura del proyecto, el mapa detallado de archivos se organiza de la siguiente manera:

```text
src/
├── auth/                               # 🔐 MÓDULO DE AUTENTICACIÓN
│   └── infrastructure/                 # Implementación de herramientas de Auth
│       ├── adapters/
│       │   └── jwt-auth.adapter.ts     # Adaptador concreto del puerto de autenticación
│       ├── controllers/
│       │   └── auth.controller.ts      # Endpoint expuesto (/auth/login)
│       ├── decorators/
│       │   └── public.decorator.ts     # Decorador custom @Public() para abrir rutas
│       ├── dto/
│       │   └── login.dto.ts            # Validación estricta de las credenciales de entrada
│       ├── guards/
│       │   └── jwt-auth.guard.ts       # Guardián global que intercepta las peticiones
│       ├── strategies/
│       │   └── jwt.strategy.ts         # Estrategia de Passport para extraer y validar JWT
│       └── auth.module.ts              # Orquestador y switch de dependencias de Auth
├── common/                             # 🛠️ COMPONENTES GLOBALES REUTILIZABLES
│   ├── dto/
│   │   └── pagination.dto.ts           # DTO genérico para peticiones de listas paginadas
│   ├── exceptions/
│   │   └── rpc-custom-exception.filter.ts # Filtro global para formatear excepciones HTTP
│   ├── interfaces/
│   │   └── paginated-data.interface.ts # Estructura tipada estándar de retornos paginados
│   └── pipes/
│       ├── parse-id.pipe.ts            # Pipe de validación general de IDs
│       └── parse-uuid-v4.pipe.ts       # Pipe estricto para validar formatos UUID v4
├── config/                             # ⚙️ CONFIGURACIÓN DEL ENTORNO
│   ├── config.module.ts                # Inicializador global de configuraciones
│   └── envs.ts                         # Esquema de validación y tipado del archivo .env
├── database/                           # 🗄️ CAPA DE PERSISTENCIA GLOBAL
│   └── infrastructure/
│       ├── prisma/
│       │   ├── prisma.service.ts       # Cliente e inicializador de conexión física con Prisma
│       │   └── prisma-client-exception.filter.ts # Filtro extractor de errores conocidos de DB (P2002/P2025)
│       └── database.module.ts          # Módulo unificado de base de datos
├── generated/                          # Archivos auto-generados por el motor de Prisma
├── products/                           # 📦 MÓDULO DE NEGOCIO (EJEMPLO)
│   ├── aplication/
│   │   ├── products.service.spec.ts    # Tests unitarios de la lógica de productos
│   │   └── products.service.ts         # Orquestador de lógica/Casos de uso de productos
│   ├── domain/
│   │   ├── entities/
│   │   │   └── product.entity.ts       # Entidad de dominio pura (Cero NestJS / Cero Prisma)
│   │   └── repositories/
│   │       └── product.repository.ts   # El PUERTO (Contrato abstracto que define las operaciones)
│   └── infrastructure/
│       ├── controllers/
│       │   └── products.controller.ts  # Capa HTTP expuesta y documentada con Swagger
│       ├── dto/
│       │   ├── create-product.dto.ts   # Validación del Payload para la creación de un producto
│       │   └── update-product.dto.ts   # Validación del Payload para la actualización parcial
│       ├── repositories/
│       │   └── prisma-product.repository.ts # El ADAPTADOR (Implementación real con queries de Prisma)
│       └── products.module.ts          # Encapsulador y switch de dependencias de productos
├── app.module.ts                       # Módulo raíz que ensambla el grafo global de dependencias
└── main.ts                             # Punto de entrada de la aplicación (Prefijo, versión, Swagger)
test/                                   # 🧪 SUITE DE INTEGRACIÓN
├── jest-e2e.json                       # Configuración de Jest para pruebas integrales
└── products.e2e-spec.ts                # Pruebas End-to-End con autenticación automática previa
```

## 📐 Justificación de las Decisiones Estratégicas

### 1\. ¿Por qué usamos JWT mediante la integración nativa de NestJS?

Para la autenticación se eligió implementar **JSON Web Tokens (JWT)** utilizando el ecosistema nativo de @nestjs/jwt y @nestjs/passport. Las razones técnicas principales son:

- **Integración Out-of-the-Box con el Ciclo de Vida:** NestJS provee un manejo nativo excelente de guardianes (Guards) y estrategias que se acoplan perfectamente con el framework sin requerir código _boilerplate_ repetitivo.

- **Seguridad Automatizada (Fail-Safe):** Al mapear el JwtAuthGuard bajo el token central de inyección APP_GUARD en el AppModule, **toda la aplicación nace cerrada de forma automática**. Cualquier endpoint nuevo que se cree requerirá un token válido por defecto, eliminando la posibilidad de que un desarrollador olvide proteger una ruta crítica por descuido.

- **Aislamiento Mediante Decoradores:** El uso de metadatos mediante el decorador custom @Public() le permite a NestJS abrir de forma selectiva endpoints públicos (como /auth/login o el GET de productos) sin alterar ni una sola línea de la configuración global de seguridad.

### 2\. Inversión de Dependencias en el Acceso a Datos

En una aplicación convencional, los servicios dependen de un ORM específico. En esta arquitectura, aplicamos el **Principio de Inversión de Dependencias (DIP)**:

- La lógica empresarial (products.service.ts) interactúa exclusivamente con el puerto ProductRepository (una interfaz/clase abstracta de TypeScript).

- El mapeo físico de los datos ocurre únicamente en prisma-product.repository.ts (el adaptador de infraestructura).

- **Beneficio Senior:** Si el día de mañana se decide migrar el ORM (por ejemplo, de Prisma a TypeORM o Drizzle), el impacto se reduce a crear un nuevo adaptador de repositorio que cumpla con el puerto y cambiar la referencia de la clase (useClass) en el products.module.ts. Los controladores, casos de uso y entidades permanecen intactos.

## 🚀 Guía de Inicialización del Entorno Local

Siga estos pasos para clonar, ejecutar y testear el template en su máquina local utilizando Docker para garantizar la consistencia absoluta del ecosistema.

### Requisitos Previos

- **Node.js** _(v20 o superior para desarrollo o comandos locales externos)_

- **Docker** y **Docker Compose**

### Pasos para Levantar la Aplicación

1.  .env.template tiene la guia para crear las variables en .env _Nota: Asegúrese de validar que las credenciales de la base de datos y el JWT_SECRET se correspondan con sus necesidades locales._

2.  docker compose up --build

3.  npx prisma migrate dev

4.  **URLs de Acceso:**
    - **API Base:** http://localhost:3000/api/v1

    - **Documentación Interactiva (Swagger UI):** http://localhost:3000/api/docs

## 🧪 Estrategia de Testing

El boilerplate viene configurado para validar la estabilidad de la app mediante dos enfoques de pruebas estrictas y tipadas:

- **Pruebas Unitarias:** Validan la lógica pura de los servicios aislando la base de datos de manera atómica.

- **Pruebas End-to-End (E2E):** Pruebas de integración reales que levantan el servidor HTTP simulado y la base de datos real en Docker. El archivo `products.e2e-spec.ts` realiza una autenticación dinámica automática en su bloque beforeAll, almacena el token de respuesta de manera estricta e inyecta las cabeceras Authorization: Bearer para validar de manera legítima el comportamiento del flujo y las restricciones de los endpoints privados.
