import { Habilidad } from '../../habilidades/entities/habilidad.entity';
import { Jugador } from '../../jugadores/entities/jugador.entity';
import { CreateHabilidadJugadorDto } from '../dto/create-habilidad-jugador.dto';
import { HabilidadJugadorResponseDto } from '../dto/habilidad-jugador-response.dto';
import { UpdateHabilidadJugadorDto } from '../dto/update-habilidad-jugador.dto';
import { HabilidadJugador } from '../entities/habilidad-jugador.entity';
export class HabilidadJugadorMapper {
  static toEntity(dto: CreateHabilidadJugadorDto, jugador: Jugador, habilidad: Habilidad): Partial<HabilidadJugador> {
    return { nivel: dto.nivel, fechaRegistro: new Date(), jugador, habilidad };
  }
  static mergeEntity(entity: HabilidadJugador, dto: UpdateHabilidadJugadorDto, jugador?: Jugador, habilidad?: Habilidad): HabilidadJugador {
    if (dto.nivel !== undefined) entity.nivel = dto.nivel;
    if (jugador) entity.jugador = jugador;
    if (habilidad) entity.habilidad = habilidad;
    return entity;
  }
  static toResponseDto(entity: HabilidadJugador): HabilidadJugadorResponseDto {
    return { id: entity.id, nivel: entity.nivel, fechaRegistro: entity.fechaRegistro instanceof Date ? entity.fechaRegistro.toISOString() : String(entity.fechaRegistro), jugadorId: entity.jugador.id, habilidadId: entity.habilidad.id };
  }
  static toResponseDtoList(entities: HabilidadJugador[]): HabilidadJugadorResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
