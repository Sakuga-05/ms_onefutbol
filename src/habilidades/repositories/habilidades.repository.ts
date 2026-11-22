import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
@Injectable()
export class HabilidadesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async hasJugadores(id: number): Promise<boolean> {
    const [row] = await this.dataSource.query('SELECT 1 FROM habilidades_jugadores WHERE habilidad_id = ? LIMIT 1', [id]);
    return Boolean(row);
  }
  async existsByName(nombre: string, excludeId?: number): Promise<boolean> {
    const [row] = await this.dataSource.query(
      'SELECT 1 FROM habilidades WHERE nombre = ? AND NOT (id <=> ?) LIMIT 1',
      [nombre, excludeId ?? null],
    );
    return Boolean(row);
  }
}
