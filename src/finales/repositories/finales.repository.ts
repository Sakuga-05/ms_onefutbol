import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Final } from '../entities/final.entity';

@Injectable()
export class FinalesRepository {
  private readonly repository: Repository<Final>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Final);
  }

  async save(entity: Partial<Final>): Promise<Final> {
    return this.repository.save(entity);
  }

  async findById(id: number): Promise<Final | null> {
    return this.repository.findOne({
      where: { id },
      relations: { fase: true },
    });
  }

  async findAll(): Promise<Final[]> {
    return this.repository.find({
      relations: { fase: true },
      order: { id: 'ASC' },
    });
  }

  async update(id: number, partial: Partial<Final>): Promise<Final | null> {
    await this.repository.update(id, partial);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async findByFase(faseId: number): Promise<Final | null> {
    return this.repository.findOne({
      where: { fase: { id: faseId } },
      relations: { fase: true },
    });
  }

  async existsByFase(faseId: number, excludeId?: number): Promise<boolean> {
    const [row] = await this.dataSource.query(
      `SELECT 1 FROM finales WHERE fase_id = ? AND NOT (id <=> ?) LIMIT 1`,
      [faseId, excludeId ?? null],
    );
    return Boolean(row);
  }
}
