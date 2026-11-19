export class DeporteResponseDto {
  id!: number;
  nombre!: string;
  descripcion!: string | null;
  esColectivo!: boolean;
  minJugadores!: number;
  maxJugadores!: number;
  activo!: boolean;
  deportePadreId!: number | null;
  subdeportes?: DeporteResponseDto[];
}
