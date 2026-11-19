import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateEquipoDeporteDto {
  @IsDateString()
  fechaInscripcion!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  entrenador?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  categoria?: string;

  @IsInt()
  @Min(1)
  equipoId!: number;

  @IsInt()
  @Min(1)
  deporteId!: number;
}
