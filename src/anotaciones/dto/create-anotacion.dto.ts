import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Max, MaxLength, Min } from 'class-validator';
export class CreateAnotacionDto {
  @IsInt() @Min(0) @Max(300) minuto!: number;
  @IsOptional() @IsString() @MaxLength(30) tipo?: string;
  @IsOptional() @IsString() descripcion?: string;
  @IsInt() @IsPositive() partidoId!: number;
  @IsInt() @IsPositive() jugadorId!: number;
}
