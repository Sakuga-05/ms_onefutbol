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

export class CreateBoletoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigo!: string;

  @IsDateString()
  @IsNotEmpty()
  fechaCompra!: string;

  @IsNumber()
  @Min(0)
  precio!: number;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  estado?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  asiento?: string;

  @IsInt()
  @IsPositive()
  aficionadoId!: number;

  @IsInt()
  @IsPositive()
  partidoId!: number;

  @IsInt()
  @IsPositive()
  localidadId!: number;
}

