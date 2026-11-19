import { CreateBoletoDto } from '../dto/create-boleto.dto';
import { BoletoResponseDto } from '../dto/boleto-response.dto';
import { UpdateBoletoDto } from '../dto/update-boleto.dto';
import { Boleto } from '../entities/boleto.entity';
import { Aficionado } from '../../aficionados/entities/aficionado.entity';
import { Localidad } from '../../localidades/entities/localidad.entity';
import { Partido } from '../../partidos/entities/partido.entity';

export class BoletoMapper {
  static toEntity(
    dto: CreateBoletoDto,
    aficionado: Aficionado,
    partido: Partido,
    localidad: Localidad,
  ): Partial<Boleto> {
    return {
      codigo: dto.codigo.trim(),
      fechaCompra: new Date(dto.fechaCompra),
      precio: dto.precio,
      estado: dto.estado ? dto.estado.trim().toUpperCase() : 'COMPRADO',
      asiento: dto.asiento?.trim() ?? null,
      aficionado,
      partido,
      localidad,
    };
  }

  static mergeEntity(
    entity: Boleto,
    dto: UpdateBoletoDto,
    aficionado?: Aficionado,
    partido?: Partido,
    localidad?: Localidad,
  ): Boleto {
    if (dto.codigo !== undefined) entity.codigo = dto.codigo.trim();
    if (dto.fechaCompra !== undefined) {
      entity.fechaCompra = new Date(dto.fechaCompra);
    }
    if (dto.precio !== undefined) entity.precio = dto.precio;
    if (dto.estado !== undefined) {
      entity.estado = dto.estado.trim().toUpperCase();
    }
    if (dto.asiento !== undefined) {
      entity.asiento = dto.asiento ? dto.asiento.trim() : null;
    }
    if (aficionado !== undefined) entity.aficionado = aficionado;
    if (partido !== undefined) entity.partido = partido;
    if (localidad !== undefined) entity.localidad = localidad;
    return entity;
  }

  static toResponseDto(entity: Boleto): BoletoResponseDto {
    return {
      id: entity.id,
      codigo: entity.codigo,
      fechaCompra:
        entity.fechaCompra instanceof Date
          ? entity.fechaCompra.toISOString()
          : String(entity.fechaCompra),
      precio: Number(entity.precio),
      estado: entity.estado,
      asiento: entity.asiento,
      aficionadoId: entity.aficionado?.id,
      partidoId: entity.partido?.id,
      localidadId: entity.localidad?.id,
    };
  }

  static toResponseDtoList(entities: Boleto[]): BoletoResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}

