import {
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

export class CreateInscripcionDto {
  @IsDateString()
  @IsNotEmpty()
  fechaInscripcion!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  numeroRegistro!: string;

  @IsNumber()
  @Min(0)
  costo!: number;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  estado?: string;

  @IsInt()
  @IsPositive()
  torneoId!: number;

  @IsInt()
  @IsPositive()
  equipoId!: number;
}
