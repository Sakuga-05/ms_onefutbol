import { CreateTorneoDto } from '../dto/create-torneo.dto';
import { TorneoResponseDto } from '../dto/torneo-response.dto';
import { UpdateTorneoDto } from '../dto/update-torneo.dto';
import { Torneo } from '../entities/torneo.entity';
import { Deporte } from '../../deportes/entities/deporte.entity';

export class TorneoMapper {
  static toEntity(dto: CreateTorneoDto, deporte: Deporte): Partial<Torneo> {
    return {
      nombre: dto.nombre.trim(),
      edicion: dto.edicion.trim(),
      fechaInicio: dto.fechaInicio,
      fechaFin: dto.fechaFin ?? null,
      premio: dto.premio ?? 0,
      activo: dto.activo ?? true,
      deporte,
    };
  }

  static mergeEntity(entity: Torneo, dto: UpdateTorneoDto, deporte?: Deporte): Torneo {
    if (dto.nombre !== undefined) entity.nombre = dto.nombre.trim();
    if (dto.edicion !== undefined) entity.edicion = dto.edicion.trim();
    if (dto.fechaInicio !== undefined) entity.fechaInicio = dto.fechaInicio;
    if (dto.fechaFin !== undefined) entity.fechaFin = dto.fechaFin ?? null;
    if (dto.premio !== undefined) entity.premio = dto.premio;
    if (dto.activo !== undefined) entity.activo = dto.activo;
    if (deporte !== undefined) entity.deporte = deporte;
    return entity;
  }

  static toResponseDto(entity: Torneo): TorneoResponseDto {
    return {
      id: entity.id,
      nombre: entity.nombre,
      edicion: entity.edicion,
      fechaInicio: entity.fechaInicio,
      fechaFin: entity.fechaFin,
      premio: Number(entity.premio),
      activo: entity.activo,
      deporteId: entity.deporte?.id,
    };
  }

  static toResponseDtoList(entities: Torneo[]): TorneoResponseDto[] {
    return entities.map((t) => this.toResponseDto(t));
  }
}
