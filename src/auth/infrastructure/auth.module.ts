import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthServicePort } from '@/auth/domain/ports/auth-service.port';
import { JwtAuthAdapter } from './adapters/jwt-auth.adapter';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { LoginUseCase } from '@/auth/aplication/use-cases/login.use-case';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key-cambiar-en-env',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    LoginUseCase,
    // 🎛️ AQUÍ ESTÁ EL SWITCH: Vinculamos el Puerto abstracto con el Adaptador de infraestructura actual
    {
      provide: AuthServicePort,
      useClass: JwtAuthAdapter,
    },
  ],
  exports: [AuthServicePort, PassportModule, JwtModule],
})
export class AuthModule {}
