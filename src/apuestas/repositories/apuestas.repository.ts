import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Apuesta } from '../entities/apuesta.entity';

@Injectable()
export class ApuestasRepository {
  private readonly repository: Repository<Apuesta>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Apuesta);
  }

  async save(entity: Partial<Apuesta>): Promise<Apuesta> {
    return this.repository.save(entity);
  }

  async findById(id: number): Promise<Apuesta | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        aficionado: true,
        partido: true,
        metodoPagoAficionado: true,
      },
    });
  }

  async findAll(): Promise<Apuesta[]> {
    return this.repository.find({
      order: { id: 'ASC' },
    });
  }

  async update(id: number, partial: Partial<Apuesta>): Promise<Apuesta | null> {
    await this.repository.update(id, partial);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  // Consulta requerida: Apuestas con aficionado, partido y método de pago
  async findAllWithDetails(): Promise<Apuesta[]> {
    return this.repository.find({
      relations: {
        aficionado: true,
        partido: true,
        metodoPagoAficionado: {
          metodoPago: true,
        },
      },
      order: { fechaHora: 'DESC' },
    });
  }

  async findByIdWithDetails(id: number): Promise<Apuesta | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        aficionado: true,
        partido: true,
        metodoPagoAficionado: {
          metodoPago: true,
        },
      },
    });
  }

  async findByAficionado(aficionadoId: number): Promise<Apuesta[]> {
    return this.repository.find({
      where: { aficionado: { id: aficionadoId } },
      relations: {
        partido: true,
        metodoPagoAficionado: {
          metodoPago: true,
        },
      },
      order: { fechaHora: 'DESC' },
    });
  }

  async findByPartido(partidoId: number): Promise<Apuesta[]> {
    return this.repository.find({
      where: { partido: { id: partidoId } },
      relations: {
        aficionado: true,
        metodoPagoAficionado: true,
      },
      order: { fechaHora: 'DESC' },
    });
  }

  // Regla de negocio: Validar que el método de pago pertenezca al aficionado que realiza la apuesta
  async isMetodoPagoBelongsToAficionado(
    metodoPagoAficionadoId: number,
    aficionadoId: number,
  ): Promise<boolean> {
    const [row] = await this.dataSource.query(
      `SELECT 1
       FROM metodos_pago_aficionados
       WHERE id = ? AND aficionado_id = ? AND activo = 1
       LIMIT 1`,
      [metodoPagoAficionadoId, aficionadoId],
    );
    return Boolean(row);
  }
}

