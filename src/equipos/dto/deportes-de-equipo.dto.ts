import { DeporteResponseDto } from '../../deportes/dto/deporte-response.dto';

export class DeportesDeEquipoDto {
  equipoId!: number;
  deportes?: DeporteResponseDto[];
}
