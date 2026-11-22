import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
@Injectable()
export class PelotasRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async existsByPartido(partidoId: number, excludeId?: number): Promise<boolean> {
    const [row] = await this.dataSource.query(
      'SELECT 1 FROM pelotas WHERE partido_id = ? AND NOT (id <=> ?) LIMIT 1',
      [partidoId, excludeId ?? null],
    );
    return Boolean(row);
  }
  async hasPosiciones(id: number): Promise<boolean> {
    const [row] = await this.dataSource.query('SELECT 1 FROM posiciones_espaciales WHERE pelota_id = ? LIMIT 1', [id]);
    return Boolean(row);
  }
}
