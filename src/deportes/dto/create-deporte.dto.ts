import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateDeporteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombre!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsBoolean()
  esColectivo!: boolean;

  @IsInt()
  @Min(1)
  minJugadores!: number;

  @IsInt()
  @Min(1)
  maxJugadores!: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  deportePadreId?: number | null;
}
