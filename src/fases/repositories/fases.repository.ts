import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Fase } from '../entities/fase.entity';

@Injectable()
export class FasesRepository {
  private readonly repository: Repository<Fase>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Fase);
  }

  async save(entity: Partial<Fase>): Promise<Fase> {
    return this.repository.save(entity);
  }

  async findById(id: number): Promise<Fase | null> {
    return this.repository.findOne({
      where: { id },
      relations: { torneo: true },
    });
  }

  async findAll(): Promise<Fase[]> {
    return this.repository.find({
      relations: { torneo: true },
      order: { orden: 'ASC', id: 'ASC' },
    });
  }

  async update(id: number, partial: Partial<Fase>): Promise<Fase | null> {
    await this.repository.update(id, partial);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async findWithPartidos(id: number): Promise<Fase | null> {
    return this.repository.findOne({
      where: { id },
      relations: { partidos: true },
    });
  }

  async findWithGrupos(id: number): Promise<Fase | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        grupos: {
          equipos: true,
        },
      },
    });
  }

  async findWithFinal(id: number): Promise<Fase | null> {
    return this.repository.findOne({
      where: { id },
      relations: { final: true },
    });
  }

  async hasDependencies(id: number): Promise<boolean> {
    const [partidos, grupos, finales] = await Promise.all([
      this.dataSource.query('SELECT 1 FROM partidos WHERE fase_id = ? LIMIT 1', [id]),
      this.dataSource.query('SELECT 1 FROM grupos WHERE fase_id = ? LIMIT 1', [id]),
      this.dataSource.query('SELECT 1 FROM finales WHERE fase_id = ? LIMIT 1', [id]),
    ]);
    return partidos.length > 0 || grupos.length > 0 || finales.length > 0;
  }
}
