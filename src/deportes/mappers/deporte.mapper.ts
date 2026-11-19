import { CreateDeporteDto } from '../dto/create-deporte.dto';
import { DeporteResponseDto } from '../dto/deporte-response.dto';
import { UpdateDeporteDto } from '../dto/update-deporte.dto';
import { Deporte } from '../entities/deporte.entity';

export class DeporteMapper {
  static toEntity(
    dto: CreateDeporteDto,
    deportePadre: Deporte | null,
  ): Partial<Deporte> {
    return {
      //El trim() es para eliminar espacios en blanco al inicio y al final del nombre
      nombre: dto.nombre.trim(),
      descripcion: dto.descripcion ?? null,
      esColectivo: dto.esColectivo,
      minJugadores: dto.minJugadores,
      maxJugadores: dto.maxJugadores,
      activo: dto.activo ?? true,
      deportePadre,
    };
  }

  static mergeEntity(entity: Deporte, dto: UpdateDeporteDto): Deporte {
    if (dto.nombre !== undefined) entity.nombre = dto.nombre.trim();
    if (dto.descripcion !== undefined) entity.descripcion = dto.descripcion;
    if (dto.esColectivo !== undefined) entity.esColectivo = dto.esColectivo;
    if (dto.minJugadores !== undefined) entity.minJugadores = dto.minJugadores;
    if (dto.maxJugadores !== undefined) entity.maxJugadores = dto.maxJugadores;
    if (dto.activo !== undefined) entity.activo = dto.activo;
    return entity;
  }

  static toResponseDto(entity: Deporte): DeporteResponseDto {
    return {
      id: entity.id,
      nombre: entity.nombre,
      descripcion: entity.descripcion,
      esColectivo: entity.esColectivo,
      minJugadores: entity.minJugadores,
      maxJugadores: entity.maxJugadores,
      activo: entity.activo,
      deportePadreId: entity.deportePadre?.id ?? null,
      subdeportes:
        entity.subdeportes?.map(
          (deporte) =>
            ({
              id: deporte.id,
              nombre: deporte.nombre,
            }) as DeporteResponseDto,
        ) ?? [],
    };
  }

  static toResponseDtoList(entities: Deporte[]): DeporteResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
