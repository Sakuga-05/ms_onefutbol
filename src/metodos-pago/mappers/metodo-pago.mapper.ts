import { CreateMetodoPagoDto } from '../dto/create-metodo-pago.dto';
import { MetodoPagoResponseDto } from '../dto/metodo-pago-response.dto';
import { UpdateMetodoPagoDto } from '../dto/update-metodo-pago.dto';
import { MetodoPago } from '../entities/metodo-pago.entity';

export class MetodoPagoMapper {
  static toEntity(dto: CreateMetodoPagoDto): Partial<MetodoPago> {
    return {
      nombre: dto.nombre.trim(),
      descripcion: dto.descripcion?.trim() ?? null,
      activo: dto.activo ?? true,
    };
  }

  static mergeEntity(
    entity: MetodoPago,
    dto: UpdateMetodoPagoDto,
  ): MetodoPago {
    if (dto.nombre !== undefined) entity.nombre = dto.nombre.trim();
    if (dto.descripcion !== undefined) {
      entity.descripcion = dto.descripcion ? dto.descripcion.trim() : null;
    }
    if (dto.activo !== undefined) entity.activo = dto.activo;
    return entity;
  }

  static toResponseDto(entity: MetodoPago): MetodoPagoResponseDto {
    return {
      id: entity.id,
      nombre: entity.nombre,
      descripcion: entity.descripcion,
      activo: entity.activo,
    };
  }

  static toResponseDtoList(entities: MetodoPago[]): MetodoPagoResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}

