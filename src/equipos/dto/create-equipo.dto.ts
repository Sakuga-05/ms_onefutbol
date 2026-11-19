import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

//Se usa porque los valores booleanos enviados desde un formulario multipart/form-data se reciben 
// como strings, por lo que se necesita transformarlos a booleanos antes de la validación.
const transformMultipartBoolean = ({ value }: { value: unknown }): unknown => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
};

export class CreateEquipoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  siglas!: string;

  @IsDateString()
  fechaFundacion!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  ciudad!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  pais!: string;

  @IsOptional()
  @Transform(transformMultipartBoolean)
  @IsBoolean()
  activo?: boolean;
}
