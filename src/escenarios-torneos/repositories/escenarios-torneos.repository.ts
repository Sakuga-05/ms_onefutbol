import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EscenarioTorneo } from '../entities/escenario-torneo.entity';

@Injectable()
export class EscenariosTorneosRepository {
  private readonly repository: Repository<EscenarioTorneo>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(EscenarioTorneo);
  }

  async save(entity: Partial<EscenarioTorneo>): Promise<EscenarioTorneo> {
    return this.repository.save(entity);
  }

  async findById(id: number): Promise<EscenarioTorneo | null> {
    return this.repository.findOne({
      where: { id },
      relations: { escenario: true, torneo: true },
    });
  }

  async findAll(): Promise<EscenarioTorneo[]> {
    return this.repository.find({
      relations: { escenario: true, torneo: true },
      order: { id: 'ASC' },
    });
  }

  async update(id: number, partial: Partial<EscenarioTorneo>): Promise<EscenarioTorneo | null> {
    await this.repository.update(id, partial);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async existsByEscenarioTorneo(escenarioId: number, torneoId: number, excludeId?: number): Promise<boolean> {
    const [row] = await this.dataSource.query(
      `SELECT 1 FROM escenarios_torneos
       WHERE escenario_id = ? AND torneo_id = ? AND NOT (id <=> ?)
       LIMIT 1`,
      [escenarioId, torneoId, excludeId ?? null],
    );
    return Boolean(row);
  }
}
