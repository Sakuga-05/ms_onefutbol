import { CreateFaseDto } from '../dto/create-fase.dto';
import { FaseResponseDto } from '../dto/fase-response.dto';
import { UpdateFaseDto } from '../dto/update-fase.dto';
import { Fase } from '../entities/fase.entity';
import { Torneo } from '../../torneos/entities/torneo.entity';

export class FaseMapper {
  static toEntity(dto: CreateFaseDto, torneo: Torneo): Partial<Fase> {
    return {
      nombre: dto.nombre.trim(),
      orden: dto.orden ?? 1,
      tipo: dto.tipo ? dto.tipo.trim().toUpperCase() : 'GRUPOS',
      activa: dto.activa ?? true,
      torneo,
    };
  }

  static mergeEntity(entity: Fase, dto: UpdateFaseDto, torneo?: Torneo): Fase {
    if (dto.nombre !== undefined) entity.nombre = dto.nombre.trim();
    if (dto.orden !== undefined) entity.orden = dto.orden;
    if (dto.tipo !== undefined) entity.tipo = dto.tipo.trim().toUpperCase();
    if (dto.activa !== undefined) entity.activa = dto.activa;
    if (torneo !== undefined) entity.torneo = torneo;
    return entity;
  }

  static toResponseDto(entity: Fase): FaseResponseDto {
    return {
      id: entity.id,
      nombre: entity.nombre,
      orden: entity.orden,
      tipo: entity.tipo,
      activa: entity.activa,
      torneoId: entity.torneo?.id,
    };
  }

  static toResponseDtoList(entities: Fase[]): FaseResponseDto[] {
    return entities.map((f) => this.toResponseDto(f));
  }
}
