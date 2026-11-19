import { EquipoResponseDto } from '../../equipos/dto/equipo-response.dto';

export class EquiposDeDeporteDto {
  deporteId!: number;
  equipos?: EquipoResponseDto[];
}
