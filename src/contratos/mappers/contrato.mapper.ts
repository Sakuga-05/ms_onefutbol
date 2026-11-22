import { Equipo } from '../../equipos/entities/equipo.entity';
import { Jugador } from '../../jugadores/entities/jugador.entity';
import { CreateContratoDto } from '../dto/create-contrato.dto';
import { ContratoResponseDto } from '../dto/contrato-response.dto';
import { UpdateContratoDto } from '../dto/update-contrato.dto';
import { Contrato } from '../entities/contrato.entity';

export class ContratoMapper {
  static toEntity(
    dto: CreateContratoDto,
    jugador: Jugador,
    equipo: Equipo,
  ): Contrato {
    const contrato = new Contrato();
    contrato.fechaInicio = dto.fechaInicio;
    contrato.fechaFin = dto.fechaFin ?? null;
    contrato.numeroCamiseta = dto.numeroCamiseta ?? null;
    contrato.posicion = dto.posicion ?? null;
    contrato.salario = dto.salario ?? 0.0;
    contrato.activo = dto.activo ?? true;
    contrato.jugador = jugador;
    contrato.equipo = equipo;
    return contrato;
  }

  static mergeEntity(
    contrato: Contrato,
    dto: UpdateContratoDto,
    jugador?: Jugador,
    equipo?: Equipo,
  ): Contrato {
    if (dto.fechaInicio !== undefined) contrato.fechaInicio = dto.fechaInicio;
    if (dto.fechaFin !== undefined) contrato.fechaFin = dto.fechaFin;
    if (dto.numeroCamiseta !== undefined) contrato.numeroCamiseta = dto.numeroCamiseta;
    if (dto.posicion !== undefined) contrato.posicion = dto.posicion;
    if (dto.salario !== undefined) contrato.salario = dto.salario;
    if (dto.activo !== undefined) contrato.activo = dto.activo;
    if (jugador) contrato.jugador = jugador;
    if (equipo) contrato.equipo = equipo;
    return contrato;
  }

  static toResponseDto(entity: Contrato): ContratoResponseDto {
    const jugadorNombre = entity.jugador
      ? `${entity.jugador.nombres} ${entity.jugador.apellidos}`.trim()
      : '';
    const equipoNombre = entity.equipo ? entity.equipo.nombre : '';

    return {
      id: entity.id,
      fechaInicio: entity.fechaInicio,
      fechaFin: entity.fechaFin ?? null,
      numeroCamiseta: entity.numeroCamiseta ?? null,
      posicion: entity.posicion ?? null,
      salario: Number(entity.salario),
      activo: Boolean(entity.activo),
      jugadorId: entity.jugador ? entity.jugador.id : 0,
      jugadorNombre,
      equipoId: entity.equipo ? entity.equipo.id : 0,
      equipoNombre,
    };
  }

  static toResponseDtoList(entities: Contrato[]): ContratoResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
