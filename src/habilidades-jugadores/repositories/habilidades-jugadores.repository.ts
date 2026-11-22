import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
@Injectable()
export class HabilidadesJugadoresRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async existsByAssociation(jugadorId: number, habilidadId: number, excludeId?: number): Promise<boolean> {
    const [row] = await this.dataSource.query(
      'SELECT 1 FROM habilidades_jugadores WHERE jugador_id = ? AND habilidad_id = ? AND NOT (id <=> ?) LIMIT 1',
      [jugadorId, habilidadId, excludeId ?? null],
    );
    return Boolean(row);
  }
}
