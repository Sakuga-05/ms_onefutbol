import { CreateEquipoDeporteDto } from '../dto/create-equipo-deporte.dto';
import { EquipoDeporteResponseDto } from '../dto/equipo-deporte-response.dto';
import { UpdateEquipoDeporteDto } from '../dto/update-equipo-deporte.dto';
import { EquipoDeporte } from '../entities/equipo-deporte.entity';

export class EquipoDeporteMapper {
  static toEntity(
    dto: CreateEquipoDeporteDto,
    equipo: EquipoDeporte['equipo'],
    deporte: EquipoDeporte['deporte'],
  ): Partial<EquipoDeporte> {
    return {
      fechaInscripcion: dto.fechaInscripcion,
      entrenador: dto.entrenador ?? null,
      categoria: dto.categoria ?? null,
      equipo,
      deporte,
    };
  }

  static mergeEntity(
    entity: EquipoDeporte,
    dto: UpdateEquipoDeporteDto,
  ): EquipoDeporte {
    if (dto.fechaInscripcion !== undefined) {
      entity.fechaInscripcion = dto.fechaInscripcion;
    }
    if (dto.entrenador !== undefined) entity.entrenador = dto.entrenador;
    if (dto.categoria !== undefined) entity.categoria = dto.categoria;
    return entity;
  }

  static toResponseDto(entity: EquipoDeporte): EquipoDeporteResponseDto {
    return {
      id: entity.id,
      fechaInscripcion: entity.fechaInscripcion,
      entrenador: entity.entrenador ?? null,
      categoria: entity.categoria ?? null,
      equipoId: entity.equipo.id,
      deporteId: entity.deporte.id,
    };
  }

  static toResponseDtoList(
    entities: EquipoDeporte[],
  ): EquipoDeporteResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
