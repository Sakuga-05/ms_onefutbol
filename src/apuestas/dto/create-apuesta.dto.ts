import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateApuestaDto {
  @IsNumber()
  @IsPositive()
  monto!: number;

  @IsNumber()
  @Min(1.01)
  cuota!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  pronostico!: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  estado?: string;

  @IsInt()
  @IsPositive()
  aficionadoId!: number;

  @IsInt()
  @IsPositive()
  partidoId!: number;

  @IsInt()
  @IsPositive()
  metodoPagoAficionadoId!: number;
}

