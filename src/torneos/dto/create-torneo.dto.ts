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

export class CreateTorneoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  edicion!: string;

  @IsDateString()
  @IsNotEmpty()
  fechaInicio!: string;

  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  premio?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsInt()
  @IsPositive()
  deporteId!: number;
}
