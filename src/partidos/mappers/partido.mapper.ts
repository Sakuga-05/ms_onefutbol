import { CreatePartidoDto } from '../dto/create-partido.dto';
import { PartidoResponseDto } from '../dto/partido-response.dto';
import { UpdatePartidoDto } from '../dto/update-partido.dto';
import { Partido } from '../entities/partido.entity';
import { Escenario } from '../../escenarios/entities/escenario.entity';
import { Equipo } from '../../equipos/entities/equipo.entity';
import { Fase } from '../../fases/entities/fase.entity';

export class PartidoMapper {
  static toEntity(
    dto: CreatePartidoDto,
    escenario: Escenario,
    fase: Fase,
    equipoLocal: Equipo,
    equipoVisitante: Equipo,
  ): Partial<Partido> {
    return {
      fechaHora: new Date(dto.fechaHora),
      estado: dto.estado ? dto.estado.trim().toUpperCase() : 'PROGRAMADO',
      descripcion: dto.descripcion?.trim() ?? null,
      escenario,
      fase,
      equipoLocal,
      equipoVisitante,
      golesLocal: dto.golesLocal ?? null,
      golesVisitante: dto.golesVisitante ?? null,
    };
  }

  static mergeEntity(
    entity: Partido,
    dto: UpdatePartidoDto,
    escenario?: Escenario,
    fase?: Fase,
    equipoLocal?: Equipo,
    equipoVisitante?: Equipo,
  ): Partido {
    if (dto.fechaHora !== undefined) {
      entity.fechaHora = new Date(dto.fechaHora);
    }
    if (dto.estado !== undefined) {
      entity.estado = dto.estado.trim().toUpperCase();
    }
    if (dto.descripcion !== undefined) {
      entity.descripcion = dto.descripcion ? dto.descripcion.trim() : null;
    }
    if (escenario !== undefined) entity.escenario = escenario;
    if (fase !== undefined) entity.fase = fase;
    if (equipoLocal !== undefined) entity.equipoLocal = equipoLocal;
    if (equipoVisitante !== undefined) entity.equipoVisitante = equipoVisitante;
    if (dto.golesLocal !== undefined) entity.golesLocal = dto.golesLocal;
    if (dto.golesVisitante !== undefined) entity.golesVisitante = dto.golesVisitante;
    return entity;
  }

  static toResponseDto(entity: Partido): PartidoResponseDto {
    return {
      id: entity.id,
      fechaHora:
        entity.fechaHora instanceof Date
          ? entity.fechaHora.toISOString()
          : String(entity.fechaHora),
      estado: entity.estado,
      descripcion: entity.descripcion,
      escenarioId: entity.escenario?.id,
      faseId: entity.fase?.id ?? null,
      equipoLocalId: entity.equipoLocal?.id ?? null,
      equipoVisitanteId: entity.equipoVisitante?.id ?? null,
      golesLocal: entity.golesLocal,
      golesVisitante: entity.golesVisitante,
    };
  }

  static toResponseDtoList(entities: Partido[]): PartidoResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
