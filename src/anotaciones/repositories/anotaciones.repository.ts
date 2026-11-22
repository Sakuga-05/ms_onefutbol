import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
@Injectable()
export class AnotacionesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async exists(partidoId: number, jugadorId: number, minuto: number, excludeId?: number): Promise<boolean> {
    const [row] = await this.dataSource.query(
      'SELECT 1 FROM anotaciones WHERE partido_id = ? AND jugador_id = ? AND minuto = ? AND NOT (id <=> ?) LIMIT 1',
      [partidoId, jugadorId, minuto, excludeId ?? null],
    );
    return Boolean(row);
  }
}
