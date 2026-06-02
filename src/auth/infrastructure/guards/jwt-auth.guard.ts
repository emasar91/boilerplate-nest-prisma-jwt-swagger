import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '@/auth/infrastructure/decorators/public.decorator';
import { AuthenticatedUser } from '@/auth/domain/interfaces/auth-response.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  override canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    return super.canActivate(context);
  }

  override handleRequest<TUser = AuthenticatedUser>(
    err: Error | null,
    user: TUser | false,
    info: Error | undefined,
  ): TUser {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          info?.message === 'jwt expired'
            ? 'El token de autenticación ha expirado.'
            : 'No estás autorizado para acceder a este recurso.',
        )
      );
    }
    return user;
  }
}
