import { IsInt, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
export class CreatePelotaDto {
  @IsOptional() @IsString() @MaxLength(50) tipo?: string;
  @IsOptional() @IsString() @MaxLength(30) estado?: string;
  @IsInt() @IsPositive() partidoId!: number;
}
