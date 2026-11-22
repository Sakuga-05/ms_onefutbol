import { CreateInscripcionDto } from '../dto/create-inscripcion.dto';
import { InscripcionResponseDto } from '../dto/inscripcion-response.dto';
import { UpdateInscripcionDto } from '../dto/update-inscripcion.dto';
import { Inscripcion } from '../entities/inscripcion.entity';
import { Equipo } from '../../equipos/entities/equipo.entity';
import { Torneo } from '../../torneos/entities/torneo.entity';

export class InscripcionMapper {
  static toEntity(
    dto: CreateInscripcionDto,
    torneo: Torneo,
    equipo: Equipo,
  ): Partial<Inscripcion> {
    return {
      fechaInscripcion: dto.fechaInscripcion,
      numeroRegistro: dto.numeroRegistro.trim(),
      costo: dto.costo,
      estado: dto.estado ? dto.estado.trim().toUpperCase() : 'CONFIRMADA',
      torneo,
      equipo,
    };
  }

  static mergeEntity(
    entity: Inscripcion,
    dto: UpdateInscripcionDto,
    torneo?: Torneo,
    equipo?: Equipo,
  ): Inscripcion {
    if (dto.fechaInscripcion !== undefined) {
      entity.fechaInscripcion = dto.fechaInscripcion;
    }
    if (dto.numeroRegistro !== undefined) {
      entity.numeroRegistro = dto.numeroRegistro.trim();
    }
    if (dto.costo !== undefined) entity.costo = dto.costo;
    if (dto.estado !== undefined) {
      entity.estado = dto.estado.trim().toUpperCase();
    }
    if (torneo !== undefined) entity.torneo = torneo;
    if (equipo !== undefined) entity.equipo = equipo;
    return entity;
  }

  static toResponseDto(entity: Inscripcion): InscripcionResponseDto {
    return {
      id: entity.id,
      fechaInscripcion: entity.fechaInscripcion,
      numeroRegistro: entity.numeroRegistro,
      costo: Number(entity.costo),
      estado: entity.estado,
      torneoId: entity.torneo?.id,
      equipoId: entity.equipo?.id,
    };
  }

  static toResponseDtoList(entities: Inscripcion[]): InscripcionResponseDto[] {
    return entities.map((i) => this.toResponseDto(i));
  }
}
