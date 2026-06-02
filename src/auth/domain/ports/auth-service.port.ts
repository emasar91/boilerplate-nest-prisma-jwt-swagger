import { LoginDto } from '@/auth/infrastructure/dto/login.dto';
import { AuthResponse } from '@/auth/domain/interfaces/auth-response.interface';

// Usamos una clase abstracta como Puerto porque NestJS no puede inyectar Interfaces de TS en tiempo de ejecución.
export abstract class AuthServicePort {
  abstract login(loginDto: LoginDto): Promise<AuthResponse>;
}
