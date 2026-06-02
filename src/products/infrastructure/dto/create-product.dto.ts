import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsPositive,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'El nombre único del producto',
    example: 'Teclado Mecánico RGB',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Precio de venta del producto', example: 149.99 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price!: number;

  @ApiProperty({
    description: 'Cantidad inicial disponible en inventario',
    example: 50,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock: number = 0;

  @ApiProperty({
    description: 'Detalle o especificaciones del producto',
    example: 'Teclado con switches Cherry MX Red',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
