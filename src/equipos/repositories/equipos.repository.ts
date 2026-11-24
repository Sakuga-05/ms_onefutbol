import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class EquiposRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async hasParticipacionCompetitiva(equipoId: number): Promise<boolean> {
    const [row] = await this.dataSource.query(
      `SELECT 1 FROM inscripciones WHERE equipo_id = ?
       UNION ALL
       SELECT 1 FROM equipos WHERE id = ? AND grupo_id IS NOT NULL
       UNION ALL
       SELECT 1 FROM finales_equipos WHERE equipo_id = ?
       UNION ALL
       SELECT 1 FROM partidos
       WHERE equipo_local_id = ? OR equipo_visitante_id = ?
       LIMIT 1`,
      [equipoId, equipoId, equipoId, equipoId, equipoId],
    );
    return Boolean(row);
  }

  async hasInscripcionEnTorneoIniciado(equipoId: number): Promise<boolean> {
    const [row] = await this.dataSource.query(
      `SELECT 1
       FROM inscripciones i
       INNER JOIN torneos t ON t.id = i.torneo_id
       WHERE i.equipo_id = ? AND t.fecha_inicio <= CURDATE()
       LIMIT 1`,
      [equipoId],
    );
    return Boolean(row);
  }

  async hasDependencies(
    id: number,
  ): Promise<{ hasDeps: boolean; reason?: string }> {
    const [deporte] = await this.dataSource.query(
      'SELECT 1 FROM equipos_deportes WHERE equipo_id = ? LIMIT 1',
      [id],
    );
    if (deporte) {
      return {
        hasDeps: true,
        reason: 'El equipo tiene disciplinas deportivas asociadas',
      };
    }

    const [contrato] = await this.dataSource.query(
      'SELECT 1 FROM contratos WHERE equipo_id = ? LIMIT 1',
      [id],
    );
    if (contrato) {
      return {
        hasDeps: true,
        reason: 'El equipo tiene jugadores o contratos asociados',
      };
    }

    const [inscripcion] = await this.dataSource.query(
      'SELECT 1 FROM inscripciones WHERE equipo_id = ? LIMIT 1',
      [id],
    );
    if (inscripcion) {
      return {
        hasDeps: true,
        reason: 'El equipo está inscrito en uno o más torneos',
      };
    }

    const [aficionado] = await this.dataSource.query(
      'SELECT 1 FROM aficionados_equipos WHERE equipo_id = ? LIMIT 1',
      [id],
    );
    if (aficionado) {
      return {
        hasDeps: true,
        reason: 'El equipo tiene aficionados vinculados',
      };
    }

    return { hasDeps: false };
  }
}
