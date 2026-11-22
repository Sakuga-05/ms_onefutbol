import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
export class CreateHabilidadDto {
  @IsString() @IsNotEmpty() @MaxLength(100) nombre!: string;
  @IsOptional() @IsString() descripcion?: string;
  @IsOptional() @IsBoolean() activa?: boolean;
}
