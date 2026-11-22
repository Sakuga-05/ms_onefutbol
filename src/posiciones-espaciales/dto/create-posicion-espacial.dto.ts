import { IsDateString, IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';
export class CreatePosicionEspacialDto {
  @IsNumber() x!: number;
  @IsNumber() y!: number;
  @IsOptional() @IsNumber() z?: number;
  @IsOptional() @IsDateString() momento?: string;
  @IsInt() @IsPositive() jugadorId!: number;
  @IsInt() @IsPositive() pelotaId!: number;
}
