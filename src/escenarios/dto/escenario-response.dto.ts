export class EscenarioResponseDto {
  id!: number;
  nombre!: string;
  descripcion!: string | null;
  ubicacion!: string;
  capacidad!: number;
  activo!: boolean;
  escenarioPadreId!: number | null;
  subescenarios?: EscenarioResponseDto[];
}

