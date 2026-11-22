export class JugadorResponseDto {
  id!: number;
  nombres!: string;
  apellidos!: string;
  identificacion!: string | null;
  numeroCamiseta!: number;
  nacionalidad!: string | null;
  activo!: boolean;
}
