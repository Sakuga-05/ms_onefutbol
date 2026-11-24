import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Contrato } from '../entities/contrato.entity';

@Injectable()
export class ContratosRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findActiveContractsByJugador(
    jugadorId: number,
    excludeId?: number,
  ): Promise<Contrato[]> {
    const contratos = await this.dataSource.getRepository(Contrato).find({
      where: {
        jugador: { id: jugadorId },
        activo: true,
      },
      relations: { jugador: true, equipo: true },
      order: { fechaFin: 'DESC', id: 'DESC' },
    });
    return excludeId
      ? contratos.filter((contrato) => contrato.id !== excludeId)
      : contratos;
  }

  async findByEquipo(equipoId: number): Promise<Contrato[]> {
    return this.dataSource.getRepository(Contrato).find({
      where: { equipo: { id: equipoId } },
      relations: { jugador: true, equipo: true },
      order: { activo: 'DESC', fechaInicio: 'DESC' },
    });
  }

  async findByJugador(jugadorId: number): Promise<Contrato[]> {
    return this.dataSource.getRepository(Contrato).find({
      where: { jugador: { id: jugadorId } },
      relations: { jugador: true, equipo: true },
      order: { activo: 'DESC', fechaInicio: 'DESC' },
    });
  }
}
