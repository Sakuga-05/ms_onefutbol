import { CreateEscenarioDto } from '../dto/create-escenario.dto';
import { EscenarioResponseDto } from '../dto/escenario-response.dto';
import { UpdateEscenarioDto } from '../dto/update-escenario.dto';
import { Escenario } from '../entities/escenario.entity';

export class EscenarioMapper {
  static toEntity(
    dto: CreateEscenarioDto,
    escenarioPadre: Escenario | null = null,
  ): Partial<Escenario> {
    return {
      nombre: dto.nombre.trim(),
      descripcion: dto.descripcion?.trim() ?? null,
      ubicacion: dto.ubicacion.trim(),
      capacidad: dto.capacidad ?? 0,
      activo: dto.activo ?? true,
      escenarioPadre,
    };
  }

  static mergeEntity(
    entity: Escenario,
    dto: UpdateEscenarioDto,
    escenarioPadre?: Escenario | null,
  ): Escenario {
    if (dto.nombre !== undefined) entity.nombre = dto.nombre.trim();
    if (dto.descripcion !== undefined) {
      entity.descripcion = dto.descripcion ? dto.descripcion.trim() : null;
    }
    if (dto.ubicacion !== undefined) entity.ubicacion = dto.ubicacion.trim();
    if (dto.capacidad !== undefined) entity.capacidad = dto.capacidad;
    if (dto.activo !== undefined) entity.activo = dto.activo;
    if (escenarioPadre !== undefined) entity.escenarioPadre = escenarioPadre;
    return entity;
  }

  static toResponseDto(entity: Escenario): EscenarioResponseDto {
    return {
      id: entity.id,
      nombre: entity.nombre,
      descripcion: entity.descripcion,
      ubicacion: entity.ubicacion,
      capacidad: entity.capacidad,
      activo: entity.activo,
      escenarioPadreId: entity.escenarioPadre?.id ?? null,
      subescenarios: entity.subescenarios
        ? entity.subescenarios.map((sub) => ({
            id: sub.id,
            nombre: sub.nombre,
            descripcion: sub.descripcion,
            ubicacion: sub.ubicacion,
            capacidad: sub.capacidad,
            activo: sub.activo,
            escenarioPadreId: entity.id,
          }))
        : [],
    };
  }

  static toResponseDtoList(entities: Escenario[]): EscenarioResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}

