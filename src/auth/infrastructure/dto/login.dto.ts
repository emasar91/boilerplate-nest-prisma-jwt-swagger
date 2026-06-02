import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'emanuel@test.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido.' })
  readonly email!: string;

  @ApiProperty({ example: '123456', description: 'Contraseña de la cuenta' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La contraseña es requerida.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  readonly password!: string;
}
