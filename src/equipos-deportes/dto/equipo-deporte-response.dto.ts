export class EquipoDeporteResponseDto {
  id!: number;
  fechaInscripcion!: string;
  entrenador!: string | null;
  categoria!: string | null;
  equipoId!: number;
  deporteId!: number;
}
