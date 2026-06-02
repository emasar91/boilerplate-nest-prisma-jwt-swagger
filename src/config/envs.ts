import 'dotenv/config';
// src/config/envs.ts
import * as joi from 'joi';

export interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  PRODUCTS_MICROSERVICES_HOST: string;
  PRODUCTS_MICROSERVICES_PORT: number;
}

const envsSchema = joi
  .object({
    PORT: joi.number().default(3000),
    DATABASE_URL: joi.string().required(),
    PRODUCTS_MICROSERVICES_HOST: joi.string().required(),
    PRODUCTS_MICROSERVICES_PORT: joi.number().required(),
  })
  .unknown(true);

export const environmentConfiguration = () => {
  // Validamos process.env (que ahora TS lo entiende perfectamente)
  const validationResult = envsSchema.validate(process.env, {
    abortEarly: false,
  });

  // 2. Evaluamos el error de forma directa
  if (validationResult.error) {
    throw new Error(
      `Config validation error: ${validationResult.error.message}`,
    );
  }

  // 3. Casteamos el objeto completo de forma segura.
  // Al decirle a TS que "value" es EnvVars, ESLint se queda tranquilo de que ya está tipado.
  const envVars = validationResult.value as EnvVars;

  return {
    port: envVars.PORT,
    databaseUrl: envVars.DATABASE_URL,
    productsMicroservice: {
      host: envVars.PRODUCTS_MICROSERVICES_HOST,
      port: envVars.PRODUCTS_MICROSERVICES_PORT,
    },
  };
};

export const APP_CONFIG_TOKEN = 'AppConfig';
export type AppConfig = ReturnType<typeof environmentConfiguration>;
