export class BoletoResponseDto {
  id!: number;
  codigo!: string;
  fechaCompra!: string;
  precio!: number;
  estado!: string;
  asiento!: string | null;
  aficionadoId!: number;
  partidoId!: number;
  localidadId!: number;
}

