import { CreateFinalDto } from '../dto/create-final.dto';
import { FinalResponseDto } from '../dto/final-response.dto';
import { UpdateFinalDto } from '../dto/update-final.dto';
import { Final } from '../entities/final.entity';
import { Fase } from '../../fases/entities/fase.entity';

export class FinalMapper {
  static toEntity(dto: CreateFinalDto, fase: Fase): Partial<Final> {
    return {
      premioCampeon: dto.premioCampeon ?? 0,
      premioSubcampeon: dto.premioSubcampeon ?? 0,
      tiempoExtra: dto.tiempoExtra ?? true,
      definicionPenales: dto.definicionPenales ?? true,
      trofeoNombre: dto.trofeoNombre.trim(),
      reglasEspecificas: dto.reglasEspecificas?.trim() ?? null,
      fase,
    };
  }

  static mergeEntity(entity: Final, dto: UpdateFinalDto, fase?: Fase): Final {
    if (dto.premioCampeon !== undefined) entity.premioCampeon = dto.premioCampeon;
    if (dto.premioSubcampeon !== undefined) entity.premioSubcampeon = dto.premioSubcampeon;
    if (dto.tiempoExtra !== undefined) entity.tiempoExtra = dto.tiempoExtra;
    if (dto.definicionPenales !== undefined) entity.definicionPenales = dto.definicionPenales;
    if (dto.trofeoNombre !== undefined) entity.trofeoNombre = dto.trofeoNombre.trim();
    if (dto.reglasEspecificas !== undefined) {
      entity.reglasEspecificas = dto.reglasEspecificas ? dto.reglasEspecificas.trim() : null;
    }
    if (fase !== undefined) entity.fase = fase;
    return entity;
  }

  static toResponseDto(entity: Final): FinalResponseDto {
    return {
      id: entity.id,
      premioCampeon: Number(entity.premioCampeon),
      premioSubcampeon: Number(entity.premioSubcampeon),
      tiempoExtra: entity.tiempoExtra,
      definicionPenales: entity.definicionPenales,
      trofeoNombre: entity.trofeoNombre,
      reglasEspecificas: entity.reglasEspecificas,
      faseId: entity.fase?.id,
    };
  }

  static toResponseDtoList(entities: Final[]): FinalResponseDto[] {
    return entities.map((f) => this.toResponseDto(f));
  }
}
