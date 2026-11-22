import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateContratoDto {
  @IsDateString()
  @IsNotEmpty()
  fechaInicio!: string;

  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  numeroCamiseta?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  posicion?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salario?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsInt()
  @IsPositive()
  jugadorId!: number;

  @IsInt()
  @IsPositive()
  equipoId!: number;
}
