import { CreateAficionadoDto } from '../dto/create-aficionado.dto';
import { AficionadoResponseDto } from '../dto/aficionado-response.dto';
import { UpdateAficionadoDto } from '../dto/update-aficionado.dto';
import { Aficionado } from '../entities/aficionado.entity';

export class AficionadoMapper {
  static toEntity(dto: CreateAficionadoDto): Partial<Aficionado> {
    return {
      nombres: dto.nombres.trim(),
      apellidos: dto.apellidos.trim(),
      tipoDocumento: dto.tipoDocumento.trim().toUpperCase(),
      numeroDocumento: dto.numeroDocumento.trim(),
      correoElectronico: dto.correoElectronico.trim().toLowerCase(),
      telefono: dto.telefono.trim(),
      activo: dto.activo ?? true,
    };
  }

  static mergeEntity(
    entity: Aficionado,
    dto: UpdateAficionadoDto,
  ): Aficionado {
    if (dto.nombres !== undefined) entity.nombres = dto.nombres.trim();
    if (dto.apellidos !== undefined) entity.apellidos = dto.apellidos.trim();
    if (dto.tipoDocumento !== undefined) {
      entity.tipoDocumento = dto.tipoDocumento.trim().toUpperCase();
    }
    if (dto.numeroDocumento !== undefined) {
      entity.numeroDocumento = dto.numeroDocumento.trim();
    }
    if (dto.correoElectronico !== undefined) {
      entity.correoElectronico = dto.correoElectronico.trim().toLowerCase();
    }
    if (dto.telefono !== undefined) entity.telefono = dto.telefono.trim();
    if (dto.activo !== undefined) entity.activo = dto.activo;
    return entity;
  }

  static toResponseDto(entity: Aficionado): AficionadoResponseDto {
    return {
      id: entity.id,
      nombres: entity.nombres,
      apellidos: entity.apellidos,
      tipoDocumento: entity.tipoDocumento,
      numeroDocumento: entity.numeroDocumento,
      correoElectronico: entity.correoElectronico,
      telefono: entity.telefono,
      activo: entity.activo,
    };
  }

  static toResponseDtoList(entities: Aficionado[]): AficionadoResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}

