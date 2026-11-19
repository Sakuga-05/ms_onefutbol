import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Escenario } from '../entities/escenario.entity';

@Injectable()
export class EscenariosRepository {
  private readonly repository: Repository<Escenario>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Escenario);
  }

  async save(entity: Partial<Escenario>): Promise<Escenario> {
    return this.repository.save(entity);
  }

  async findById(id: number): Promise<Escenario | null> {
    return this.repository.findOne({
      where: { id },
      relations: { escenarioPadre: true },
    });
  }

  async findAll(): Promise<Escenario[]> {
    return this.repository.find({
      relations: { escenarioPadre: true },
      order: { id: 'ASC' },
    });
  }

  async update(id: number, partial: Partial<Escenario>): Promise<Escenario | null> {
    await this.repository.update(id, partial);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  // Consulta requerida: Un escenario con sus escenarios hijos (subescenarios)
  async findWithSubescenarios(id: number): Promise<Escenario | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        escenarioPadre: true,
        subescenarios: true,
      },
    });
  }

  // Consulta requerida: Un escenario con sus localidades
  async findWithLocalidades(id: number): Promise<Escenario | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        localidades: true,
      },
    });
  }

  // Consulta requerida: Un escenario con sus partidos
  async findWithPartidos(id: number): Promise<Escenario | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        partidos: true,
      },
    });
  }

  // Validación de nombre único
  async existsByName(nombre: string, excludeId?: number): Promise<boolean> {
    const [row] = await this.dataSource.query(
      `SELECT 1
       FROM escenarios
       WHERE TRIM(REGEXP_REPLACE(nombre, '[[:space:]]+', ' ')) COLLATE utf8mb4_general_ci =
             TRIM(REGEXP_REPLACE(?, '[[:space:]]+', ' ')) COLLATE utf8mb4_general_ci
         AND NOT (id <=> ?)
       LIMIT 1`,
      [nombre, excludeId ?? null],
    );
    return Boolean(row);
  }

  // Validación antes de eliminar: comprobar si tiene dependencias
  async hasDependencies(id: number): Promise<{
    hasSubescenarios: boolean;
    hasLocalidades: boolean;
    hasPartidos: boolean;
  }> {
    const [subescenarios, localidades, partidos] = await Promise.all([
      this.repository.count({ where: { escenarioPadre: { id } } }),
      this.dataSource.query('SELECT 1 FROM localidades WHERE escenario_id = ? LIMIT 1', [id]),
      this.dataSource.query('SELECT 1 FROM partidos WHERE escenario_id = ? LIMIT 1', [id]),
    ]);

    return {
      hasSubescenarios: subescenarios > 0,
      hasLocalidades: localidades.length > 0,
      hasPartidos: partidos.length > 0,
    };
  }
}

