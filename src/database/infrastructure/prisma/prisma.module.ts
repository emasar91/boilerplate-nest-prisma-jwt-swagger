import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 💡 Esto lo hace accesible en toda la app sin re-importar
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exponemos el servicio para los controladores y otros servicios
})
export class PrismaModule {}
