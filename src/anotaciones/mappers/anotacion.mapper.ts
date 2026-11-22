import { Jugador } from '../../jugadores/entities/jugador.entity';
import { Partido } from '../../partidos/entities/partido.entity';
import { CreateAnotacionDto } from '../dto/create-anotacion.dto';
import { AnotacionResponseDto } from '../dto/anotacion-response.dto';
import { UpdateAnotacionDto } from '../dto/update-anotacion.dto';
import { Anotacion } from '../entities/anotacion.entity';
export class AnotacionMapper {
  static toEntity(dto: CreateAnotacionDto, partido: Partido, jugador: Jugador): Partial<Anotacion> {
    return { minuto: dto.minuto, tipo: dto.tipo?.trim().toUpperCase() ?? 'GOL', descripcion: dto.descripcion?.trim() ?? null, partido, jugador };
  }
  static mergeEntity(entity: Anotacion, dto: UpdateAnotacionDto, partido?: Partido, jugador?: Jugador): Anotacion {
    if (dto.minuto !== undefined) entity.minuto = dto.minuto;
    if (dto.tipo !== undefined) entity.tipo = dto.tipo.trim().toUpperCase();
    if (dto.descripcion !== undefined) entity.descripcion = dto.descripcion ? dto.descripcion.trim() : null;
    if (partido) entity.partido = partido;
    if (jugador) entity.jugador = jugador;
    return entity;
  }
  static toResponseDto(entity: Anotacion): AnotacionResponseDto {
    return { id: entity.id, minuto: entity.minuto, tipo: entity.tipo, descripcion: entity.descripcion, partidoId: entity.partido.id, jugadorId: entity.jugador.id };
  }
  static toResponseDtoList(entities: Anotacion[]): AnotacionResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
