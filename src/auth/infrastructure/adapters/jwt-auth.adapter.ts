import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthServicePort } from '@/auth/domain/ports/auth-service.port';
import { LoginDto } from '@/auth/infrastructure/dto/login.dto';
import { AuthResponse } from '@/auth/domain/interfaces/auth-response.interface';
import { JwtPayload } from '@/auth/infrastructure/strategies/jwt.strategy';

@Injectable()
export class JwtAuthAdapter implements AuthServicePort {
  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // TODO: En producción, inyectar el repositorio de usuarios de Prisma y validar bcrypt
    const isUserValid = email === 'emanuel@test.com' && password === '123456';

    if (!isUserValid) {
      throw new UnauthorizedException(
        'Credenciales incorrectas. Verifique su email y contraseña.',
      );
    }

    const payload: JwtPayload = {
      sub: 'bf120d9a-84bf-42f0-bc32-1a423d2400d1', // Simulación de UUID de base de datos
      email: email,
    };

    return await Promise.resolve({
      accessToken: this.jwtService.sign(payload),
      user: {
        userId: payload.sub,
        email: payload.email,
      },
    });
  }
}
