import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Inscripcion } from '../entities/inscripcion.entity';

@Injectable()
export class InscripcionesRepository {
  private readonly repository: Repository<Inscripcion>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Inscripcion);
  }

  async save(entity: Partial<Inscripcion>): Promise<Inscripcion> {
    return this.repository.save(entity);
  }

  async findById(id: number): Promise<Inscripcion | null> {
    return this.repository.findOne({
      where: { id },
      relations: { torneo: true, equipo: true },
    });
  }

  async findAll(): Promise<Inscripcion[]> {
    return this.repository.find({
      relations: { torneo: true, equipo: true },
      order: { id: 'ASC' },
    });
  }

  async update(id: number, partial: Partial<Inscripcion>): Promise<Inscripcion | null> {
    await this.repository.update(id, partial);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async existsByTorneoEquipo(torneoId: number, equipoId: number, excludeId?: number): Promise<boolean> {
    const [row] = await this.dataSource.query(
      `SELECT 1 FROM inscripciones
       WHERE torneo_id = ? AND equipo_id = ? AND NOT (id <=> ?)
       LIMIT 1`,
      [torneoId, equipoId, excludeId ?? null],
    );
    return Boolean(row);
  }

  async existsByNumeroRegistro(numeroRegistro: string, excludeId?: number): Promise<boolean> {
    const [row] = await this.dataSource.query(
      `SELECT 1 FROM inscripciones
       WHERE numero_registro = ? AND NOT (id <=> ?)
       LIMIT 1`,
      [numeroRegistro, excludeId ?? null],
    );
    return Boolean(row);
  }
}
