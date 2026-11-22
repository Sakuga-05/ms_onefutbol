import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class JugadoresRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async existsByIdentificacion(
    identificacion: string,
    excludeId?: number,
  ): Promise<boolean> {
    const params: (string | number)[] = [identificacion];
    let query = 'SELECT 1 FROM jugadores WHERE identificacion = ?';
    if (excludeId !== undefined) {
      query += ' AND id <> ?';
      params.push(excludeId);
    }
    query += ' LIMIT 1';
    const [row] = await this.dataSource.query(query, params);
    return Boolean(row);
  }

  async hasDependencies(
    id: number,
  ): Promise<{ hasDeps: boolean; reason?: string }> {
    const [anotacion] = await this.dataSource.query(
      'SELECT 1 FROM anotaciones WHERE jugador_id = ? LIMIT 1',
      [id],
    );
    if (anotacion) {
      return {
        hasDeps: true,
        reason: 'El jugador tiene anotaciones/goles registrados en partidos',
      };
    }

    const [contrato] = await this.dataSource.query(
      'SELECT 1 FROM contratos WHERE jugador_id = ? LIMIT 1',
      [id],
    );
    if (contrato) {
      return {
        hasDeps: true,
        reason: 'El jugador tiene contratos o historial de equipos asociados',
      };
    }

    const [habilidad] = await this.dataSource.query(
      'SELECT 1 FROM habilidades_jugadores WHERE jugador_id = ? LIMIT 1',
      [id],
    );
    if (habilidad) {
      return {
        hasDeps: true,
        reason: 'El jugador tiene habilidades deportivas asignadas',
      };
    }

    const [posicion] = await this.dataSource.query(
      'SELECT 1 FROM posiciones_espaciales WHERE jugador_id = ? LIMIT 1',
      [id],
    );
    if (posicion) {
      return {
        hasDeps: true,
        reason: 'El jugador tiene registros de posiciones espaciales en partidos',
      };
    }

    return { hasDeps: false };
  }

  async findEquiposWithContratos(id: number) {
    return this.dataSource.query(
      `SELECT c.id AS contrato_id, c.fecha_inicio, c.fecha_fin, c.numero_camiseta, c.posicion, c.salario, c.activo,
              e.id AS equipo_id, e.nombre AS equipo_nombre, e.siglas AS equipo_siglas, e.ciudad AS equipo_ciudad, e.pais AS equipo_pais
       FROM contratos c
       INNER JOIN equipos e ON c.equipo_id = e.id
       WHERE c.jugador_id = ?
       ORDER BY c.activo DESC, c.fecha_inicio DESC`,
      [id],
    );
  }

  async findHabilidadesWithNivel(id: number) {
    return this.dataSource.query(
      `SELECT hj.id AS relacion_id, hj.nivel, hj.fecha_registro,
              h.id AS habilidad_id, h.nombre AS habilidad_nombre, h.descripcion AS habilidad_descripcion, h.activa AS habilidad_activa
       FROM habilidades_jugadores hj
       INNER JOIN habilidades h ON hj.habilidad_id = h.id
       WHERE hj.jugador_id = ?
       ORDER BY hj.nivel DESC, h.nombre ASC`,
      [id],
    );
  }
}
