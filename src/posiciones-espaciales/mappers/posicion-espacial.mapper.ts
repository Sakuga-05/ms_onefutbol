import { Jugador } from '../../jugadores/entities/jugador.entity';
import { Pelota } from '../../pelotas/entities/pelota.entity';
import { CreatePosicionEspacialDto } from '../dto/create-posicion-espacial.dto';
import { PosicionEspacialResponseDto } from '../dto/posicion-espacial-response.dto';
import { UpdatePosicionEspacialDto } from '../dto/update-posicion-espacial.dto';
import { PosicionEspacial } from '../entities/posicion-espacial.entity';
export class PosicionEspacialMapper {
  static toEntity(dto: CreatePosicionEspacialDto, jugador: Jugador, pelota: Pelota): Partial<PosicionEspacial> {
    return { x: dto.x.toFixed(2), y: dto.y.toFixed(2), z: dto.z !== undefined ? dto.z.toFixed(2) : null, momento: dto.momento ? new Date(dto.momento) : new Date(), jugador, pelota };
  }
  static mergeEntity(entity: PosicionEspacial, dto: UpdatePosicionEspacialDto, jugador?: Jugador, pelota?: Pelota): PosicionEspacial {
    if (dto.x !== undefined) entity.x = dto.x.toFixed(2);
    if (dto.y !== undefined) entity.y = dto.y.toFixed(2);
    if (dto.z !== undefined) entity.z = dto.z === null ? null : dto.z.toFixed(2);
    if (dto.momento !== undefined) entity.momento = new Date(dto.momento);
    if (jugador) entity.jugador = jugador;
    if (pelota) entity.pelota = pelota;
    return entity;
  }
  static toResponseDto(entity: PosicionEspacial): PosicionEspacialResponseDto {
    return { id: entity.id, x: entity.x, y: entity.y, z: entity.z, momento: entity.momento instanceof Date ? entity.momento.toISOString() : String(entity.momento), jugadorId: entity.jugador.id, pelotaId: entity.pelota.id };
  }
  static toResponseDtoList(entities: PosicionEspacial[]): PosicionEspacialResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
