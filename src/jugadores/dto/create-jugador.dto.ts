import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateJugadorDto {
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
  @MaxLength(30)
  identificacion!: string;

  @IsInt()
  @IsPositive()
  numeroCamiseta!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nacionalidad!: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
