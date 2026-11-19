export class MetodoPagoAficionadoResponseDto {
  id!: number;
  alias!: string;
  detalles!: string | null;
  activo!: boolean;
  fechaRegistro!: string;
  aficionadoId!: number;
  metodoPagoId!: number;
}

