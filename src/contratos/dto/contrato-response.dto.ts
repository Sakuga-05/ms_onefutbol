export class ContratoResponseDto {
  id!: number;
  fechaInicio!: string;
  fechaFin!: string | null;
  numeroCamiseta!: number | null;
  posicion!: string | null;
  salario!: number;
  activo!: boolean;
  jugadorId!: number;
  jugadorNombre!: string;
  equipoId!: number;
  equipoNombre!: string;
}
