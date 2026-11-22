import { CreateJugadorDto } from '../dto/create-jugador.dto';
import { JugadorResponseDto } from '../dto/jugador-response.dto';
import { UpdateJugadorDto } from '../dto/update-jugador.dto';
import { Jugador } from '../entities/jugador.entity';

export class JugadorMapper {
  static toEntity(dto: CreateJugadorDto): Partial<Jugador> {
    return {
      nombres: dto.nombres.trim(),
      apellidos: dto.apellidos.trim(),
      identificacion: dto.identificacion?.trim() ?? null,
      numeroCamiseta: dto.numeroCamiseta,
      nacionalidad: dto.nacionalidad?.trim() ?? null,
      activo: dto.activo ?? true,
    };
  }
  static mergeEntity(entity: Jugador, dto: UpdateJugadorDto): Jugador {
    if (dto.nombres !== undefined) entity.nombres = dto.nombres.trim();
    if (dto.apellidos !== undefined) entity.apellidos = dto.apellidos.trim();
    if (dto.identificacion !== undefined) entity.identificacion = dto.identificacion ? dto.identificacion.trim() : null;
    if (dto.numeroCamiseta !== undefined) entity.numeroCamiseta = dto.numeroCamiseta;
    if (dto.nacionalidad !== undefined) entity.nacionalidad = dto.nacionalidad ? dto.nacionalidad.trim() : null;
    if (dto.activo !== undefined) entity.activo = dto.activo;
    return entity;
  }
  static toResponseDto(entity: Jugador): JugadorResponseDto {
    return {
      id: entity.id,
      nombres: entity.nombres,
      apellidos: entity.apellidos,
      identificacion: entity.identificacion ?? null,
      numeroCamiseta: entity.numeroCamiseta,
      nacionalidad: entity.nacionalidad ?? null,
      activo: entity.activo,
    };
  }
  static toResponseDtoList(entities: Jugador[]): JugadorResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
