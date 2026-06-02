import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

interface StructuredRpcError {
  status?: unknown;
  message?: unknown;
  [key: string]: unknown; // Permite el spread seguro de propiedades dinámicas
}

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const rcpError = exception.getError();

    // 1. Validamos que el error sea un objeto estructurado
    if (rcpError && typeof rcpError === 'object') {
      const errorObject = rcpError as StructuredRpcError;

      const parsedStatus = Number(errorObject.status);

      const status =
        Number.isFinite(parsedStatus) &&
        parsedStatus >= 100 &&
        parsedStatus < 600
          ? parsedStatus
          : HttpStatus.BAD_REQUEST;

      // Determinamos el mensaje de forma segura sin romper tipos ni escupir [object Object]
      let errorMessage: string;

      if (typeof errorObject.message === 'string') {
        errorMessage = errorObject.message;
      } else {
        // 💡 Si es un objeto, lo transformamos a string JSON para que sea legible
        errorMessage = JSON.stringify(rcpError);
      }

      return response.status(status).json({
        status,
        message: errorMessage,
        ...errorObject, // El spread es seguro con la firma de índice
      });
    }

    // 2. Si el error es un string plano (ej: throw new RpcException('Id no encontrado'))
    response.status(HttpStatus.BAD_REQUEST).json({
      status: HttpStatus.BAD_REQUEST,
      message:
        typeof rcpError === 'string'
          ? rcpError
          : 'Unknown microservice exception',
    });
  }
}
