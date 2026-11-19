import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
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
}

