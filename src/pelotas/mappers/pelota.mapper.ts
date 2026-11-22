import { Partido } from '../../partidos/entities/partido.entity';
import { CreatePelotaDto } from '../dto/create-pelota.dto';
import { PelotaResponseDto } from '../dto/pelota-response.dto';
import { UpdatePelotaDto } from '../dto/update-pelota.dto';
import { Pelota } from '../entities/pelota.entity';
export class PelotaMapper {
  static toEntity(dto: CreatePelotaDto, partido: Partido): Partial<Pelota> {
    return { tipo: dto.tipo?.trim() ?? null, estado: dto.estado?.trim() ?? null, partido };
  }
  static mergeEntity(entity: Pelota, dto: UpdatePelotaDto, partido?: Partido): Pelota {
    if (dto.tipo !== undefined) entity.tipo = dto.tipo ? dto.tipo.trim() : null;
    if (dto.estado !== undefined) entity.estado = dto.estado ? dto.estado.trim() : null;
    if (partido) entity.partido = partido;
    return entity;
  }
  static toResponseDto(entity: Pelota): PelotaResponseDto {
    return { id: entity.id, tipo: entity.tipo, estado: entity.estado, partidoId: entity.partido.id };
  }
  static toResponseDtoList(entities: Pelota[]): PelotaResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
