import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Partido } from '../entities/partido.entity';

@Injectable()
export class PartidosRepository {
  private readonly repository: Repository<Partido>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Partido);
  }

  async save(entity: Partial<Partido>): Promise<Partido> {
    return this.repository.save(entity);
  }

  async findById(id: number): Promise<Partido | null> {
    return this.repository.findOne({
      where: { id },
      relations: { escenario: true },
    });
  }

  async findAll(): Promise<Partido[]> {
    return this.repository.find({
      relations: { escenario: true },
      order: { fechaHora: 'ASC' },
    });
  }

  async update(id: number, partial: Partial<Partido>): Promise<Partido | null> {
    await this.repository.update(id, partial);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  // Consulta requerida: Un partido con su escenario y sus boletos
  async findWithEscenarioAndBoletos(id: number): Promise<Partido | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        escenario: true,
        boletos: {
          aficionado: true,
          localidad: true,
        },
      },
    });
  }

  // Consulta requerida: Un partido con su escenario
  async findWithEscenario(id: number): Promise<Partido | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        escenario: true,
      },
    });
  }

  // Consulta requerida: Un partido con sus boletos
  async findWithBoletos(id: number): Promise<Partido | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        boletos: true,
      },
    });
  }

  // Consulta: Un partido con sus apuestas
  async findWithApuestas(id: number): Promise<Partido | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        apuestas: {
          aficionado: true,
          metodoPagoAficionado: true,
        },
      },
    });
  }

  // Consultar partidos por escenario
  async findByEscenario(escenarioId: number): Promise<Partido[]> {
    return this.repository.find({
      where: { escenario: { id: escenarioId } },
      relations: { escenario: true },
      order: { fechaHora: 'ASC' },
    });
  }

  // Comprobar si tiene boletos asociados antes de eliminar
  async hasBoletos(id: number): Promise<boolean> {
    const [row] = await this.dataSource.query(
      `SELECT 1 FROM boletos WHERE partido_id = ? LIMIT 1`,
      [id],
    );
    return Boolean(row);
  }
}

