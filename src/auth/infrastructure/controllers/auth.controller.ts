import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from '@/auth/infrastructure/decorators/public.decorator';
import { LoginUseCase } from '@/auth/aplication/use-cases/login.use-case';
import { LoginDto } from '@/auth/infrastructure/dto/login.dto';
import { AuthResponse } from '@/auth/domain/interfaces/auth-response.interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication') // 📂 Agrupa estos endpoints en una sección separada en la UI
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión y obtener el token de acceso' })
  @ApiResponse({
    status: 200,
    description: 'Autenticación exitosa. Devuelve el token.',
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.loginUseCase.execute(loginDto);
  }
}
