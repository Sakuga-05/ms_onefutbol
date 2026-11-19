export class EquipoResponseDto {
  id!: number;
  nombre!: string;
  siglas!: string;
  fechaFundacion!: string;
  ciudad!: string;
  pais!: string;
  escudo!: string | null;
  activo!: boolean;
}
