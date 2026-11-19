import { CreatePartidoDto } from '../dto/create-partido.dto';
import { PartidoResponseDto } from '../dto/partido-response.dto';
import { UpdatePartidoDto } from '../dto/update-partido.dto';
import { Partido } from '../entities/partido.entity';
import { Escenario } from '../../escenarios/entities/escenario.entity';

export class PartidoMapper {
  static toEntity(
    dto: CreatePartidoDto,
    escenario: Escenario,
  ): Partial<Partido> {
    return {
      fechaHora: new Date(dto.fechaHora),
      estado: dto.estado ? dto.estado.trim().toUpperCase() : 'PROGRAMADO',
      descripcion: dto.descripcion?.trim() ?? null,
      escenario,
    };
  }

  static mergeEntity(
    entity: Partido,
    dto: UpdatePartidoDto,
    escenario?: Escenario,
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
    };
  }

  static toResponseDtoList(entities: Partido[]): PartidoResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}

