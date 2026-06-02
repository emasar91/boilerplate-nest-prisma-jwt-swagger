import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // 💡 Convierte el string de la URL a número nativo
  limit?: number = 10;

  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number = 0;
}
