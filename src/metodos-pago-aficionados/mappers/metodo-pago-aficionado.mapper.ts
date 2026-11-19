import { CreateMetodoPagoAficionadoDto } from '../dto/create-metodo-pago-aficionado.dto';
import { MetodoPagoAficionadoResponseDto } from '../dto/metodo-pago-aficionado-response.dto';
import { UpdateMetodoPagoAficionadoDto } from '../dto/update-metodo-pago-aficionado.dto';
import { MetodoPagoAficionado } from '../entities/metodo-pago-aficionado.entity';
import { Aficionado } from '../../aficionados/entities/aficionado.entity';
import { MetodoPago } from '../../metodos-pago/entities/metodo-pago.entity';

export class MetodoPagoAficionadoMapper {
  static toEntity(
    dto: CreateMetodoPagoAficionadoDto,
    aficionado: Aficionado,
    metodoPago: MetodoPago,
  ): Partial<MetodoPagoAficionado> {
    return {
      alias: dto.alias.trim(),
      detalles: dto.detalles?.trim() ?? null,
      activo: dto.activo ?? true,
      fechaRegistro: new Date(),
      aficionado,
      metodoPago,
    };
  }

  static mergeEntity(
    entity: MetodoPagoAficionado,
    dto: UpdateMetodoPagoAficionadoDto,
    aficionado?: Aficionado,
    metodoPago?: MetodoPago,
  ): MetodoPagoAficionado {
    if (dto.alias !== undefined) entity.alias = dto.alias.trim();
    if (dto.detalles !== undefined) {
      entity.detalles = dto.detalles ? dto.detalles.trim() : null;
    }
    if (dto.activo !== undefined) entity.activo = dto.activo;
    if (aficionado !== undefined) entity.aficionado = aficionado;
    if (metodoPago !== undefined) entity.metodoPago = metodoPago;
    return entity;
  }

  static toResponseDto(
    entity: MetodoPagoAficionado,
  ): MetodoPagoAficionadoResponseDto {
    return {
      id: entity.id,
      alias: entity.alias,
      detalles: entity.detalles,
      activo: entity.activo,
      fechaRegistro:
        entity.fechaRegistro instanceof Date
          ? entity.fechaRegistro.toISOString()
          : String(entity.fechaRegistro),
      aficionadoId: entity.aficionado?.id,
      metodoPagoId: entity.metodoPago?.id,
    };
  }

  static toResponseDtoList(
    entities: MetodoPagoAficionado[],
  ): MetodoPagoAficionadoResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}

