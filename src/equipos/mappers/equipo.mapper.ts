import { CreateEquipoDto } from '../dto/create-equipo.dto';
import { EquipoResponseDto } from '../dto/equipo-response.dto';
import { UpdateEquipoDto } from '../dto/update-equipo.dto';
import { Equipo } from '../entities/equipo.entity';

export class EquipoMapper {
  static toEntity(dto: CreateEquipoDto, escudo: string | null): Partial<Equipo> {
    return {
      nombre: dto.nombre,
      siglas: dto.siglas,
      fechaFundacion: dto.fechaFundacion,
      ciudad: dto.ciudad,
      pais: dto.pais,
      escudo,
      activo: dto.activo ?? true,
    };
  }

  static mergeEntity(entity: Equipo, dto: UpdateEquipoDto, escudo?: string): Equipo {
    if (dto.nombre !== undefined) entity.nombre = dto.nombre;
    if (dto.siglas !== undefined) entity.siglas = dto.siglas;
    if (dto.fechaFundacion !== undefined) entity.fechaFundacion = dto.fechaFundacion;
    if (dto.ciudad !== undefined) entity.ciudad = dto.ciudad;
    if (dto.pais !== undefined) entity.pais = dto.pais;
    if (dto.activo !== undefined) entity.activo = dto.activo;
    if (escudo !== undefined) entity.escudo = escudo;
    return entity;
  }

  static toResponseDto(entity: Equipo): EquipoResponseDto {
    return {
      id: entity.id,
      nombre: entity.nombre,
      siglas: entity.siglas,
      fechaFundacion: entity.fechaFundacion,
      ciudad: entity.ciudad,
      pais: entity.pais,
      escudo: entity.escudo ?? null,
      activo: entity.activo,
    };
  }

  static toResponseDtoList(entities: Equipo[]): EquipoResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
