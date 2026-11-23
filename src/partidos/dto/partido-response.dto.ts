export class PartidoResponseDto {
  id!: number;
  fechaHora!: string;
  estado!: string;
  descripcion!: string | null;
  escenarioId!: number;
  faseId!: number | null;
  equipoLocalId!: number | null;
  equipoVisitanteId!: number | null;
  golesLocal!: number | null;
  golesVisitante!: number | null;
}
