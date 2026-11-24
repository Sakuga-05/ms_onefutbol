import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreateHabilidadDto {
  @IsString() @IsNotEmpty() @MaxLength(100) nombre!: string;
  @IsString() @IsNotEmpty() @Matches(/\S/) descripcion!: string;
  @IsOptional() @IsBoolean() activa?: boolean;
}
