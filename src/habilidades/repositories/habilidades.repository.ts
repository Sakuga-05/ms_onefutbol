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

  async findJugadoresByHabilidad(id: number) {
    return this.dataSource.query(
      `SELECT hj.id AS relacion_id, hj.nivel, hj.fecha_registro,
              j.id AS jugador_id, j.nombres, j.apellidos, j.identificacion, j.numero_camiseta, j.nacionalidad, j.activo
       FROM habilidades_jugadores hj
       INNER JOIN jugadores j ON hj.jugador_id = j.id
       WHERE hj.habilidad_id = ?
       ORDER BY hj.nivel DESC, j.apellidos ASC`,
      [id],
    );
  }
}
