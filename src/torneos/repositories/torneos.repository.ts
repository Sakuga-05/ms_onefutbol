import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Torneo } from '../entities/torneo.entity';

@Injectable()
export class TorneosRepository {
  private readonly repository: Repository<Torneo>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Torneo);
  }

  async save(entity: Partial<Torneo>): Promise<Torneo> {
    return this.repository.save(entity);
  }

  async findById(id: number): Promise<Torneo | null> {
    return this.repository.findOne({
      where: { id },
      relations: { deporte: true },
    });
  }

  async findAll(): Promise<Torneo[]> {
    return this.repository.find({
      relations: { deporte: true },
      order: { id: 'ASC' },
    });
  }

  async update(id: number, partial: Partial<Torneo>): Promise<Torneo | null> {
    await this.repository.update(id, partial);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async existsByName(nombre: string, excludeId?: number): Promise<boolean> {
    const [row] = await this.dataSource.query(
      `SELECT 1 FROM torneos
       WHERE TRIM(REGEXP_REPLACE(nombre, '[[:space:]]+', ' ')) COLLATE utf8mb4_general_ci =
             TRIM(REGEXP_REPLACE(?, '[[:space:]]+', ' ')) COLLATE utf8mb4_general_ci
         AND NOT (id <=> ?)
       LIMIT 1`,
      [nombre, excludeId ?? null],
    );
    return Boolean(row);
  }

  async findWithFases(id: number): Promise<Torneo | null> {
    return this.repository.findOne({
      where: { id },
      relations: { fases: true, deporte: true },
    });
  }

  async findWithInscripciones(id: number): Promise<Torneo | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        deporte: true,
        inscripciones: {
          equipo: true,
        },
      },
    });
  }

  async findWithEscenarios(id: number): Promise<Torneo | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        deporte: true,
        escenariosTorneos: {
          escenario: true,
        },
      },
    });
  }

  async hasDependencies(id: number): Promise<boolean> {
    const [fases, inscripciones, escenarios, partidos] = await Promise.all([
      this.dataSource.query('SELECT 1 FROM fases WHERE torneo_id = ? LIMIT 1', [id]),
      this.dataSource.query('SELECT 1 FROM inscripciones WHERE torneo_id = ? LIMIT 1', [id]),
      this.dataSource.query('SELECT 1 FROM escenarios_torneos WHERE torneo_id = ? LIMIT 1', [id]),
      this.dataSource.query(
        'SELECT 1 FROM partidos p INNER JOIN fases f ON p.fase_id = f.id WHERE f.torneo_id = ? LIMIT 1',
        [id],
      ),
    ]);
    return (
      fases.length > 0 ||
      inscripciones.length > 0 ||
      escenarios.length > 0 ||
      partidos.length > 0
    );
  }
}
