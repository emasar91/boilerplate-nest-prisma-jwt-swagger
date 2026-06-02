import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError) // 🎯 Le decimos a NestJS que este filtro solo atrapa errores conocidos de Prisma
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  override catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 🕵️‍♂️ Evaluamos el código de error específico de Prisma
    switch (exception.code) {
      case 'P2002': {
        // Código P2002 = Clave Duplicada (Unique Constraint)
        const status = HttpStatus.CONFLICT; // 409 Conflict
        let targetField = 'campo';

        // 1. Intentamos la forma clásica por si cambia la configuración de la DB
        if (exception.meta?.target && Array.isArray(exception.meta.target)) {
          targetField = (exception.meta.target as string[]).join(', ');
        }
        // 2. Si falla (por usar Driver Adapter), raspamos el mensaje de error con Regex
        else if (exception.message) {
          // Busca texto entre paréntesis después de "fields: " -> (`name`) o (name)
          const match = /fields:\s*(?:\(`([^`)]+)`\)\s*|\(([^)]+)\))/i.exec(
            exception.message,
          );
          // El match puede caer en el grupo 1 (con acentos graves ` `) o grupo 2 (limpio)
          const extracted = match?.[1] || match?.[2];
          if (extracted) {
            targetField = extracted;
          }
        }

        response.status(status).json({
          statusCode: status,
          error: 'Conflict',
          message: `Ya existe un registro con ese valor en el campo: [${targetField}].`,
          timestamp: new Date().toISOString(),
        });
        break;
      }

      case 'P2025': {
        // Código P2025 = Registro no encontrado
        const status = HttpStatus.NOT_FOUND; // 404 Not Found

        response.status(status).json({
          statusCode: status,
          error: 'Not Found',
          message:
            exception.message ||
            'El registro solicitado no fue encontrado en la base de datos.',
          timestamp: new Date().toISOString(),
        });
        break;
      }

      default:
        // Si es cualquier otro error de Prisma que no mapeamos explícitamente, delegamos al filtro base (500)
        super.catch(exception, host);
        break;
    }
  }
}
