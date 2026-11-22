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

export class CreateFinalDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  premioCampeon?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  premioSubcampeon?: number;

  @IsOptional()
  @IsBoolean()
  tiempoExtra?: boolean;

  @IsOptional()
  @IsBoolean()
  definicionPenales?: boolean;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  trofeoNombre!: string;

  @IsOptional()
  @IsString()
  reglasEspecificas?: string;

  @IsInt()
  @IsPositive()
  faseId!: number;
}
