import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateLocalidadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsInt()
  @Min(1)
  capacidad!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precioBase?: number;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;

  @IsInt()
  @IsPositive()
  escenarioId!: number;
}

