import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Grupo } from '../entities/grupo.entity';

@Injectable()
export class GruposRepository {
  private readonly repository: Repository<Grupo>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Grupo);
  }

  async save(entity: Partial<Grupo>): Promise<Grupo> {
    return this.repository.save(entity);
  }

  async findById(id: number): Promise<Grupo | null> {
    return this.repository.findOne({
      where: { id },
      relations: { fase: true },
    });
  }

  async findAll(): Promise<Grupo[]> {
    return this.repository.find({
      relations: { fase: true },
      order: { id: 'ASC' },
    });
  }

  async update(id: number, partial: Partial<Grupo>): Promise<Grupo | null> {
    await this.repository.update(id, partial);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async findWithEquipos(id: number): Promise<Grupo | null> {
    return this.repository.findOne({
      where: { id },
      relations: { equipos: true },
    });
  }

  async hasEquipos(id: number): Promise<boolean> {
    const [row] = await this.dataSource.query(
      'SELECT 1 FROM equipos WHERE grupo_id = ? LIMIT 1',
      [id],
    );
    return Boolean(row);
  }
}
