import { CreateGrupoDto } from '../dto/create-grupo.dto';
import { GrupoResponseDto } from '../dto/grupo-response.dto';
import { UpdateGrupoDto } from '../dto/update-grupo.dto';
import { Grupo } from '../entities/grupo.entity';
import { Fase } from '../../fases/entities/fase.entity';

export class GrupoMapper {
  static toEntity(dto: CreateGrupoDto, fase: Fase): Partial<Grupo> {
    return {
      nombre: dto.nombre.trim(),
      descripcion: dto.descripcion?.trim() ?? null,
      activo: dto.activo ?? true,
      fase,
    };
  }

  static mergeEntity(entity: Grupo, dto: UpdateGrupoDto, fase?: Fase): Grupo {
    if (dto.nombre !== undefined) entity.nombre = dto.nombre.trim();
    if (dto.descripcion !== undefined) entity.descripcion = dto.descripcion?.trim() ?? null;
    if (dto.activo !== undefined) entity.activo = dto.activo;
    if (fase !== undefined) entity.fase = fase;
    return entity;
  }

  static toResponseDto(entity: Grupo): GrupoResponseDto {
    return {
      id: entity.id,
      nombre: entity.nombre,
      descripcion: entity.descripcion,
      activo: entity.activo,
      faseId: entity.fase?.id,
    };
  }

  static toResponseDtoList(entities: Grupo[]): GrupoResponseDto[] {
    return entities.map((g) => this.toResponseDto(g));
  }
}
