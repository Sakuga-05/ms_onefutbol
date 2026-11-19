import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MetodoPago } from '../entities/metodo-pago.entity';

@Injectable()
export class MetodosPagoRepository {
  private readonly repository: Repository<MetodoPago>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(MetodoPago);
  }

  async save(entity: Partial<MetodoPago>): Promise<MetodoPago> {
    return this.repository.save(entity);
  }

  async findById(id: number): Promise<MetodoPago | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findAll(): Promise<MetodoPago[]> {
    return this.repository.find({
      order: { id: 'ASC' },
    });
  }

  async update(id: number, partial: Partial<MetodoPago>): Promise<MetodoPago | null> {
    await this.repository.update(id, partial);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async existsByName(nombre: string, excludeId?: number): Promise<boolean> {
    const [row] = await this.dataSource.query(
      `SELECT 1
       FROM metodos_pago
       WHERE TRIM(REGEXP_REPLACE(nombre, '[[:space:]]+', ' ')) COLLATE utf8mb4_general_ci =
             TRIM(REGEXP_REPLACE(?, '[[:space:]]+', ' ')) COLLATE utf8mb4_general_ci
         AND NOT (id <=> ?)
       LIMIT 1`,
      [nombre, excludeId ?? null],
    );
    return Boolean(row);
  }

  async hasAficionados(id: number): Promise<boolean> {
    const [row] = await this.dataSource.query(
      `SELECT 1 FROM metodos_pago_aficionados WHERE metodo_pago_id = ? LIMIT 1`,
      [id],
    );
    return Boolean(row);
  }
}

