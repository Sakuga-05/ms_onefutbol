import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MetodoPagoAficionado } from '../entities/metodo-pago-aficionado.entity';

@Injectable()
export class MetodosPagoAficionadosRepository {
  private readonly repository: Repository<MetodoPagoAficionado>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(MetodoPagoAficionado);
  }

  async save(
    entity: Partial<MetodoPagoAficionado>,
  ): Promise<MetodoPagoAficionado> {
    return this.repository.save(entity);
  }

  async findById(id: number): Promise<MetodoPagoAficionado | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        aficionado: true,
        metodoPago: true,
      },
    });
  }

  async findAll(): Promise<MetodoPagoAficionado[]> {
    return this.repository.find({
      relations: {
        aficionado: true,
        metodoPago: true,
      },
      order: { id: 'ASC' },
    });
  }

  async update(
    id: number,
    partial: Partial<MetodoPagoAficionado>,
  ): Promise<MetodoPagoAficionado | null> {
    await this.repository.update(id, partial);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  // Consultar todos los métodos de pago registrados por un aficionado
  async findByAficionado(aficionadoId: number): Promise<MetodoPagoAficionado[]> {
    return this.repository.find({
      where: { aficionado: { id: aficionadoId } },
      relations: {
        metodoPago: true,
      },
      order: { id: 'ASC' },
    });
  }

  // Comprobar si tiene apuestas asociadas antes de eliminar
  async hasApuestas(id: number): Promise<boolean> {
    const [row] = await this.dataSource.query(
      `SELECT 1 FROM apuestas WHERE metodo_pago_aficionado_id = ? LIMIT 1`,
      [id],
    );
    return Boolean(row);
  }
}

