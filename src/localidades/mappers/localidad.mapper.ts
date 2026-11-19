import { CreateLocalidadDto } from '../dto/create-localidad.dto';
import { LocalidadResponseDto } from '../dto/localidad-response.dto';
import { UpdateLocalidadDto } from '../dto/update-localidad.dto';
import { Localidad } from '../entities/localidad.entity';
import { Escenario } from '../../escenarios/entities/escenario.entity';

export class LocalidadMapper {
  static toEntity(
    dto: CreateLocalidadDto,
    escenario: Escenario,
  ): Partial<Localidad> {
    return {
      nombre: dto.nombre.trim(),
      descripcion: dto.descripcion?.trim() ?? null,
      capacidad: dto.capacidad,
      precioBase: dto.precioBase ?? 0,
      activa: dto.activa ?? true,
      escenario,
    };
  }

  static mergeEntity(
    entity: Localidad,
    dto: UpdateLocalidadDto,
    escenario?: Escenario,
  ): Localidad {
    if (dto.nombre !== undefined) entity.nombre = dto.nombre.trim();
    if (dto.descripcion !== undefined) {
      entity.descripcion = dto.descripcion ? dto.descripcion.trim() : null;
    }
    if (dto.capacidad !== undefined) entity.capacidad = dto.capacidad;
    if (dto.precioBase !== undefined) entity.precioBase = dto.precioBase;
    if (dto.activa !== undefined) entity.activa = dto.activa;
    if (escenario !== undefined) entity.escenario = escenario;
    return entity;
  }

  static toResponseDto(entity: Localidad): LocalidadResponseDto {
    return {
      id: entity.id,
      nombre: entity.nombre,
      descripcion: entity.descripcion,
      capacidad: entity.capacidad,
      precioBase: Number(entity.precioBase),
      activa: entity.activa,
      escenarioId: entity.escenario?.id,
    };
  }

  static toResponseDtoList(entities: Localidad[]): LocalidadResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}

