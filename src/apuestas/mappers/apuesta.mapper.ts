import { CreateApuestaDto } from '../dto/create-apuesta.dto';
import { ApuestaResponseDto } from '../dto/apuesta-response.dto';
import { UpdateApuestaDto } from '../dto/update-apuesta.dto';
import { Apuesta } from '../entities/apuesta.entity';
import { Aficionado } from '../../aficionados/entities/aficionado.entity';
import { MetodoPagoAficionado } from '../../metodos-pago-aficionados/entities/metodo-pago-aficionado.entity';
import { Partido } from '../../partidos/entities/partido.entity';

export class ApuestaMapper {
  static toEntity(
    dto: CreateApuestaDto,
    aficionado: Aficionado,
    partido: Partido,
    metodoPagoAficionado: MetodoPagoAficionado,
  ): Partial<Apuesta> {
    const gananciaPotencial = Number((dto.monto * dto.cuota).toFixed(2));
    return {
      monto: dto.monto,
      cuota: dto.cuota,
      pronostico: dto.pronostico.trim(),
      gananciaPotencial,
      estado: dto.estado ? dto.estado.trim().toUpperCase() : 'PENDIENTE',
      fechaHora: new Date(),
      aficionado,
      partido,
      metodoPagoAficionado,
    };
  }

  static mergeEntity(
    entity: Apuesta,
    dto: UpdateApuestaDto,
    aficionado?: Aficionado,
    partido?: Partido,
    metodoPagoAficionado?: MetodoPagoAficionado,
  ): Apuesta {
    if (dto.monto !== undefined) entity.monto = dto.monto;
    if (dto.cuota !== undefined) entity.cuota = dto.cuota;
    if (dto.monto !== undefined || dto.cuota !== undefined) {
      const monto = dto.monto ?? entity.monto;
      const cuota = dto.cuota ?? entity.cuota;
      entity.gananciaPotencial = Number((monto * cuota).toFixed(2));
    }
    if (dto.pronostico !== undefined) entity.pronostico = dto.pronostico.trim();
    if (dto.estado !== undefined) {
      entity.estado = dto.estado.trim().toUpperCase();
    }
    if (aficionado !== undefined) entity.aficionado = aficionado;
    if (partido !== undefined) entity.partido = partido;
    if (metodoPagoAficionado !== undefined) {
      entity.metodoPagoAficionado = metodoPagoAficionado;
    }
    return entity;
  }

  static toResponseDto(entity: Apuesta): ApuestaResponseDto {
    return {
      id: entity.id,
      monto: Number(entity.monto),
      cuota: Number(entity.cuota),
      pronostico: entity.pronostico,
      gananciaPotencial: Number(entity.gananciaPotencial),
      estado: entity.estado,
      fechaHora:
        entity.fechaHora instanceof Date
          ? entity.fechaHora.toISOString()
          : String(entity.fechaHora),
      aficionadoId: entity.aficionado?.id,
      partidoId: entity.partido?.id,
      metodoPagoAficionadoId: entity.metodoPagoAficionado?.id,
    };
  }

  static toResponseDtoList(entities: Apuesta[]): ApuestaResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}

