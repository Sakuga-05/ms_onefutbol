import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateEscenarioTorneoDto {
  @IsDateString()
  @IsNotEmpty()
  fechaAsignacion!: string;

  @IsOptional()
  @IsBoolean()
  esPrincipal?: boolean;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsInt()
  @IsPositive()
  escenarioId!: number;

  @IsInt()
  @IsPositive()
  torneoId!: number;
}
