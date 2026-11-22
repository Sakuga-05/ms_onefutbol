import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Contrato } from '../entities/contrato.entity';

@Injectable()
export class ContratosRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async existsActiveContract(
    jugadorId: number,
    equipoId: number,
    excludeId?: number,
  ): Promise<boolean> {
    const params: (number | boolean)[] = [jugadorId, equipoId, true];
    let query =
      'SELECT 1 FROM contratos WHERE jugador_id = ? AND equipo_id = ? AND activo = ?';
    if (excludeId !== undefined) {
      query += ' AND id <> ?';
      params.push(excludeId);
    }
    query += ' LIMIT 1';
    const [row] = await this.dataSource.query(query, params);
    return Boolean(row);
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
