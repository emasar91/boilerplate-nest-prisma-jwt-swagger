// src/config/config.module.ts
import { Module, Global } from '@nestjs/common';
import { environmentConfiguration, APP_CONFIG_TOKEN } from './envs';

@Global() // 👈 Hace que el proveedor esté disponible en toda la app sin re-importar el módulo
@Module({
  providers: [
    {
      provide: APP_CONFIG_TOKEN,
      // Ejecutamos la función. Si falta una env, acá el proceso va a tronar (Fail-fast)
      useValue: environmentConfiguration(),
    },
  ],
  exports: [APP_CONFIG_TOKEN], // 👈 Exportamos el token para que sea inyectable
})
export class AppConfigModule {}
