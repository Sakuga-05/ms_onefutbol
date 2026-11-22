import { Aficionado } from '../../aficionados/entities/aficionado.entity';
import { Equipo } from '../../equipos/entities/equipo.entity';
import { CreateAficionadoEquipoDto } from '../dto/create-aficionado-equipo.dto';
import { AficionadoEquipoResponseDto } from '../dto/aficionado-equipo-response.dto';
import { UpdateAficionadoEquipoDto } from '../dto/update-aficionado-equipo.dto';
import { AficionadoEquipo } from '../entities/aficionado-equipo.entity';
export class AficionadoEquipoMapper {
  static toEntity(dto: CreateAficionadoEquipoDto, aficionado: Aficionado, equipo: Equipo): Partial<AficionadoEquipo> {
    return { fechaAsociacion: dto.fechaAsociacion, activo: dto.activo ?? true, aficionado, equipo };
  }
  static mergeEntity(entity: AficionadoEquipo, dto: UpdateAficionadoEquipoDto, aficionado?: Aficionado, equipo?: Equipo): AficionadoEquipo {
    if (dto.fechaAsociacion !== undefined) entity.fechaAsociacion = dto.fechaAsociacion;
    if (dto.activo !== undefined) entity.activo = dto.activo;
    if (aficionado) entity.aficionado = aficionado;
    if (equipo) entity.equipo = equipo;
    return entity;
  }
  static toResponseDto(entity: AficionadoEquipo): AficionadoEquipoResponseDto {
    return { id: entity.id, fechaAsociacion: entity.fechaAsociacion, activo: entity.activo, aficionadoId: entity.aficionado.id, equipoId: entity.equipo.id };
  }
  static toResponseDtoList(entities: AficionadoEquipo[]): AficionadoEquipoResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
