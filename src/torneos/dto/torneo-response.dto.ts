export class TorneoResponseDto {
  id!: number;
  nombre!: string;
  edicion!: string;
  fechaInicio!: string;
  fechaFin!: string | null;
  premio!: number;
  activo!: boolean;
  deporteId!: number;
}
