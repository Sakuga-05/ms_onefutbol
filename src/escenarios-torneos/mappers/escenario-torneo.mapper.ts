import { CreateEscenarioTorneoDto } from '../dto/create-escenario-torneo.dto';
import { EscenarioTorneoResponseDto } from '../dto/escenario-torneo-response.dto';
import { UpdateEscenarioTorneoDto } from '../dto/update-escenario-torneo.dto';
import { EscenarioTorneo } from '../entities/escenario-torneo.entity';
import { Escenario } from '../../escenarios/entities/escenario.entity';
import { Torneo } from '../../torneos/entities/torneo.entity';

export class EscenarioTorneoMapper {
  static toEntity(
    dto: CreateEscenarioTorneoDto,
    escenario: Escenario,
    torneo: Torneo,
  ): Partial<EscenarioTorneo> {
    return {
      fechaAsignacion: dto.fechaAsignacion,
      esPrincipal: dto.esPrincipal ?? false,
      activo: dto.activo ?? true,
      escenario,
      torneo,
    };
  }

  static mergeEntity(
    entity: EscenarioTorneo,
    dto: UpdateEscenarioTorneoDto,
    escenario?: Escenario,
    torneo?: Torneo,
  ): EscenarioTorneo {
    if (dto.fechaAsignacion !== undefined) entity.fechaAsignacion = dto.fechaAsignacion;
    if (dto.esPrincipal !== undefined) entity.esPrincipal = dto.esPrincipal;
    if (dto.activo !== undefined) entity.activo = dto.activo;
    if (escenario !== undefined) entity.escenario = escenario;
    if (torneo !== undefined) entity.torneo = torneo;
    return entity;
  }

  static toResponseDto(entity: EscenarioTorneo): EscenarioTorneoResponseDto {
    return {
      id: entity.id,
      fechaAsignacion: entity.fechaAsignacion,
      esPrincipal: entity.esPrincipal,
      activo: entity.activo,
      escenarioId: entity.escenario?.id,
      torneoId: entity.torneo?.id,
    };
  }

  static toResponseDtoList(entities: EscenarioTorneo[]): EscenarioTorneoResponseDto[] {
    return entities.map((et) => this.toResponseDto(et));
  }
}
