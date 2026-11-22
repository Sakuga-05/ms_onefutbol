import { IsBoolean, IsDateString, IsInt, IsOptional, IsPositive } from 'class-validator';
export class CreateAficionadoEquipoDto {
  @IsDateString() fechaAsociacion!: string;
  @IsOptional() @IsBoolean() activo?: boolean;
  @IsInt() @IsPositive() aficionadoId!: number;
  @IsInt() @IsPositive() equipoId!: number;
}
