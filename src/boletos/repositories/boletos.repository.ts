import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Boleto } from '../entities/boleto.entity';

@Injectable()
export class BoletosRepository {
  private readonly repository: Repository<Boleto>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Boleto);
  }

  async save(entity: Partial<Boleto>): Promise<Boleto> {
    return this.repository.save(entity);
  }

  async findById(id: number): Promise<Boleto | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        aficionado: true,
        partido: true,
        localidad: true,
      },
    });
  }

  async findAll(): Promise<Boleto[]> {
    return this.repository.find({
      order: { id: 'ASC' },
    });
  }

  async update(id: number, partial: Partial<Boleto>): Promise<Boleto | null> {
    await this.repository.update(id, partial);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  // Consulta requerida: Los boletos con sus respectivos aficionados, partidos y localidades
  async findAllWithDetails(): Promise<Boleto[]> {
    return this.repository.find({
      relations: {
        aficionado: true,
        partido: true,
        localidad: true,
      },
      order: { id: 'ASC' },
    });
  }

  // Consulta requerida: Buscar por ID con sus relaciones completas
  async findByIdWithDetails(id: number): Promise<Boleto | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        aficionado: true,
        partido: true,
        localidad: true,
      },
    });
  }

  // Boletos por aficionado
  async findByAficionado(aficionadoId: number): Promise<Boleto[]> {
    return this.repository.find({
      where: { aficionado: { id: aficionadoId } },
      relations: {
        partido: true,
        localidad: true,
      },
      order: { fechaCompra: 'DESC' },
    });
  }

  // Boletos por partido
  async findByPartido(partidoId: number): Promise<Boleto[]> {
    return this.repository.find({
      where: { partido: { id: partidoId } },
      relations: {
        aficionado: true,
        localidad: true,
      },
      order: { id: 'ASC' },
    });
  }

  // Boletos por localidad
  async findByLocalidad(localidadId: number): Promise<Boleto[]> {
    return this.repository.find({
      where: { localidad: { id: localidadId } },
      relations: {
        aficionado: true,
        partido: true,
      },
      order: { id: 'ASC' },
    });
  }

  // Comprobar si ya existe un código de boleto
  async existsByCodigo(codigo: string, excludeId?: number): Promise<boolean> {
    const [row] = await this.dataSource.query(
      `SELECT 1
       FROM boletos
       WHERE codigo = ?
         AND NOT (id <=> ?)
       LIMIT 1`,
      [codigo, excludeId ?? null],
    );
    return Boolean(row);
  }

  // Regla de negocio: Validar que la localidad pertenezca al mismo escenario donde se juega el partido
  async isLocalidadInPartidoEscenario(
    localidadId: number,
    partidoId: number,
  ): Promise<boolean> {
    const [row] = await this.dataSource.query(
      `SELECT 1
       FROM localidades l
       INNER JOIN partidos p ON p.escenario_id = l.escenario_id
       WHERE l.id = ? AND p.id = ?
       LIMIT 1`,
      [localidadId, partidoId],
    );
    return Boolean(row);
  }
}

