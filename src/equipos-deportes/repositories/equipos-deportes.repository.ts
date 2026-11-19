import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class EquiposDeportesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async existsByAssociation(
    equipoId: number,
    deporteId: number,
    excludeId?: number,
  ): Promise<boolean> {
    const [row] = await this.dataSource.query(
      `SELECT 1
       FROM equipos_deportes
       WHERE equipo_id = ?
         AND deporte_id = ?
         AND NOT (id <=> ?)
       LIMIT 1`,
      [equipoId, deporteId, excludeId ?? null],
    );
    return Boolean(row);
  }
}
