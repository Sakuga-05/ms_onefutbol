import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Localidad } from '../entities/localidad.entity';

@Injectable()
export class LocalidadesRepository {
  private readonly repository: Repository<Localidad>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Localidad);
  }

  async save(entity: Partial<Localidad>): Promise<Localidad> {
    return this.repository.save(entity);
  }

  async findById(id: number): Promise<Localidad | null> {
    return this.repository.findOne({
      where: { id },
      relations: { escenario: true },
    });
  }

  async findAll(): Promise<Localidad[]> {
    return this.repository.find({
      relations: { escenario: true },
      order: { id: 'ASC' },
    });
  }

  async update(id: number, partial: Partial<Localidad>): Promise<Localidad | null> {
    await this.repository.update(id, partial);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  // Consulta requerida: Una localidad con su escenario
  async findWithEscenario(id: number): Promise<Localidad | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        escenario: true,
      },
    });
  }

  // Consulta requerida: Una localidad con sus boletos
  async findWithBoletos(id: number): Promise<Localidad | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        boletos: true,
      },
    });
  }

  // Consultar localidades por escenario
  async findByEscenario(escenarioId: number): Promise<Localidad[]> {
    return this.repository.find({
      where: { escenario: { id: escenarioId } },
      relations: { escenario: true },
      order: { id: 'ASC' },
    });
  }

  // Validación de unicidad de nombre de localidad dentro de un mismo escenario
  async existsByNameInEscenario(
    nombre: string,
    escenarioId: number,
    excludeId?: number,
  ): Promise<boolean> {
    const [row] = await this.dataSource.query(
      `SELECT 1
       FROM localidades
       WHERE escenario_id = ?
         AND TRIM(REGEXP_REPLACE(nombre, '[[:space:]]+', ' ')) COLLATE utf8mb4_general_ci =
             TRIM(REGEXP_REPLACE(?, '[[:space:]]+', ' ')) COLLATE utf8mb4_general_ci
         AND NOT (id <=> ?)
       LIMIT 1`,
      [escenarioId, nombre, excludeId ?? null],
    );
    return Boolean(row);
  }

  // Comprobar si tiene boletos asociados antes de eliminar
  async hasBoletos(id: number): Promise<boolean> {
    const [row] = await this.dataSource.query(
      `SELECT 1 FROM boletos WHERE localidad_id = ? LIMIT 1`,
      [id],
    );
    return Boolean(row);
  }
}

