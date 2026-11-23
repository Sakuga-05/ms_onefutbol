import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePartidoDto {
  @IsDateString()
  @IsNotEmpty()
  fechaHora!: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  estado?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsInt()
  @IsPositive()
  escenarioId!: number;

  @IsInt()
  @IsPositive()
  faseId!: number;

  @IsInt()
  @IsPositive()
  equipoLocalId!: number;

  @IsInt()
  @IsPositive()
  equipoVisitanteId!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  golesLocal?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  golesVisitante?: number;
}
