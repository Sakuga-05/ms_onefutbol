import { IsInt, IsPositive, Max, Min } from 'class-validator';
export class CreateHabilidadJugadorDto {
  @IsInt() @Min(1) @Max(100) nivel!: number;
  @IsInt() @IsPositive() jugadorId!: number;
  @IsInt() @IsPositive() habilidadId!: number;
}
