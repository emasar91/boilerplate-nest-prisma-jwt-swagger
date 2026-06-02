import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateProductDto } from '@/products/infrastructure/dto/create-product.dto';
import { UpdateProductDto } from '@/products/infrastructure/dto/update-product.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { ProductsService } from '@/products/aplication/products.service';
import { Public } from '@/auth/infrastructure/decorators/public.decorator';
import { ParseUuidV4Pipe } from '@/common/pipes/parse-uuid-v4.pipe';

@ApiTags('Products')
@ApiBearerAuth('JWT-auth')
// 📢 RESPUESTAS GLOBALES DEL CONTROLADOR (Evitan repetir esto en cada endpoint privado)
@ApiResponse({
  status: 401,
  description: 'No autorizado. Token JWT inexistente, inválido o expirado.',
})
@ApiResponse({ status: 500, description: 'Error interno del servidor.' })
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente.' })
  @ApiResponse({
    status: 400,
    description: 'Payload de entrada inválido (Fallo de validación DTO).',
  })
  @ApiResponse({
    status: 409,
    description:
      'Conflicto. Ya existe un producto con ese valor único (ej: nombre duplicado).',
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Public() // 🔓 Exceptuado de la protección global y del 401 de Swagger
  @Get()
  @ApiOperation({ summary: 'Obtener lista paginada de productos activos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos devuelta exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros de paginación inválidos.',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(
      paginationDto.limit!,
      paginationDto.offset!,
    );
  }

  @Public() // 🔓 Exceptuado de la protección global y del 401 de Swagger
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto específico por su ID UUID' })
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado y devuelto con éxito.',
  })
  @ApiResponse({
    status: 400,
    description: 'El ID proporcionado no tiene un formato UUID v4 válido.',
  })
  @ApiResponse({
    status: 404,
    description: 'El producto con el ID solicitado no existe.',
  })
  findOne(@Param('id', ParseUuidV4Pipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar propiedades de un producto' })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Payload de entrada o UUID inválido.',
  })
  @ApiResponse({
    status: 404,
    description: 'El producto que se intenta actualizar no existe.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto. Los nuevos datos rompen una restricción única.',
  })
  update(
    @Param('id', ParseUuidV4Pipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Dar de baja un producto (Soft Delete)' })
  @ApiResponse({
    status: 200,
    description: 'Producto dado de baja exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'El ID proporcionado no tiene un formato UUID v4 válido.',
  })
  @ApiResponse({
    status: 404,
    description: 'El producto que se intenta eliminar no existe.',
  })
  remove(@Param('id', ParseUuidV4Pipe) id: string) {
    return this.productsService.remove(id);
  }
}
