import { Injectable } from '@nestjs/common';
import { AuthServicePort } from '@/auth/domain/ports/auth-service.port';
import { LoginDto } from '@/auth/infrastructure/dto/login.dto';
import { AuthResponse } from '@/auth/domain/interfaces/auth-response.interface';

@Injectable()
export class LoginUseCase {
  // El caso de uso depende del PUERTO, no le importa si atrás hay JWT o Auth0
  constructor(private readonly authServicePort: AuthServicePort) {}

  async execute(loginDto: LoginDto): Promise<AuthResponse> {
    return this.authServicePort.login(loginDto);
  }
}
