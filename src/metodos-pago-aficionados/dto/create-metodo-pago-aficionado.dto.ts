import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateMetodoPagoAficionadoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  alias!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  detalles?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsInt()
  @IsPositive()
  aficionadoId!: number;

  @IsInt()
  @IsPositive()
  metodoPagoId!: number;
}

