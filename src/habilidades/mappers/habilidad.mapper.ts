import { CreateHabilidadDto } from '../dto/create-habilidad.dto';
import { HabilidadResponseDto } from '../dto/habilidad-response.dto';
import { UpdateHabilidadDto } from '../dto/update-habilidad.dto';
import { Habilidad } from '../entities/habilidad.entity';
export class HabilidadMapper {
  static toEntity(dto: CreateHabilidadDto): Partial<Habilidad> {
    return { nombre: dto.nombre.trim(), descripcion: dto.descripcion?.trim() ?? null, activa: dto.activa ?? true };
  }
  static mergeEntity(entity: Habilidad, dto: UpdateHabilidadDto): Habilidad {
    if (dto.nombre !== undefined) entity.nombre = dto.nombre.trim();
    if (dto.descripcion !== undefined) entity.descripcion = dto.descripcion ? dto.descripcion.trim() : null;
    if (dto.activa !== undefined) entity.activa = dto.activa;
    return entity;
  }
  static toResponseDto(entity: Habilidad): HabilidadResponseDto {
    return { id: entity.id, nombre: entity.nombre, descripcion: entity.descripcion, activa: entity.activa };
  }
  static toResponseDtoList(entities: Habilidad[]): HabilidadResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
