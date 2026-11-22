import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
@Injectable()
export class AficionadosEquiposRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async existsByAssociation(aficionadoId: number, equipoId: number, excludeId?: number): Promise<boolean> {
    const [row] = await this.dataSource.query(
      'SELECT 1 FROM aficionados_equipos WHERE aficionado_id = ? AND equipo_id = ? AND NOT (id <=> ?) LIMIT 1',
      [aficionadoId, equipoId, excludeId ?? null],
    );
    return Boolean(row);
  }
}
