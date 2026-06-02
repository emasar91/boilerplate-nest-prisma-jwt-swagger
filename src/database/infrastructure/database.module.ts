import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exportamos el servicio para que lo usen los repositorios de infraestructura
})
export class DataBaseModule {}
