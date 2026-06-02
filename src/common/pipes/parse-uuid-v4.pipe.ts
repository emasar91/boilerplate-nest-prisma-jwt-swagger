import {
  BadRequestException,
  HttpStatus,
  Injectable,
  ParseUUIDPipe,
} from '@nestjs/common';

@Injectable()
export class ParseUuidV4Pipe extends ParseUUIDPipe {
  constructor() {
    // 🧠 Pasamos la configuración al constructor del ParseUUIDPipe nativo usando super()
    super({
      version: '4', // 🔒 Fuerza estrictamente UUID v4
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      exceptionFactory: () => {
        // 💬 Centralizás el mensaje de error de todo tu boilerplate acá
        return new BadRequestException(
          'El ID proporcionado no tiene un formato UUID v4 válido.',
        );
      },
    });
  }
}
