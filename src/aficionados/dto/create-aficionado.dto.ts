import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAficionadoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombres!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellidos!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  tipoDocumento!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  numeroDocumento!: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(150)
  correoElectronico!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  telefono!: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

