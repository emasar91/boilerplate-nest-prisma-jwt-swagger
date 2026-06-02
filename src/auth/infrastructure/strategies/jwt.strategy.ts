import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticatedUser } from '@/auth/domain/interfaces/auth-response.interface';

export interface JwtPayload {
  readonly sub: string;
  readonly email: string;
  readonly iat?: number;
  readonly exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key-cambiar-en-env',
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    return await Promise.resolve({
      userId: payload.sub,
      email: payload.email,
    });
  }
}
