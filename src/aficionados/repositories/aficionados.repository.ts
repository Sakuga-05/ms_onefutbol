import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Aficionado } from '../entities/aficionado.entity';

@Injectable()
export class AficionadosRepository {
  private readonly repository: Repository<Aficionado>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Aficionado);
  }

  async save(entity: Partial<Aficionado>): Promise<Aficionado> {
    return this.repository.save(entity);
  }

  async findById(id: number): Promise<Aficionado | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findAll(): Promise<Aficionado[]> {
    return this.repository.find({
      order: { id: 'ASC' },
    });
  }

  async update(id: number, partial: Partial<Aficionado>): Promise<Aficionado | null> {
    await this.repository.update(id, partial);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  // Consulta requerida: Un aficionado con sus boletos
  async findWithBoletos(id: number): Promise<Aficionado | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        boletos: {
          partido: true,
          localidad: true,
        },
      },
    });
  }

  // Consulta: Un aficionado con sus métodos de pago
  async findWithMetodosPago(id: number): Promise<Aficionado | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        metodosPago: {
          metodoPago: true,
        },
      },
    });
  }

  // Consulta: Un aficionado con sus apuestas realizadas
  async findWithApuestas(id: number): Promise<Aficionado | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        apuestas: {
          partido: true,
          metodoPagoAficionado: true,
        },
      },
    });
  }

  async findByNumeroDocumento(numeroDocumento: string): Promise<Aficionado | null> {
    return this.repository.findOne({
      where: { numeroDocumento },
    });
  }

  async findByCorreo(correoElectronico: string): Promise<Aficionado | null> {
    return this.repository.findOne({
      where: { correoElectronico },
    });
  }

  async existsByDocumento(numeroDocumento: string, excludeId?: number): Promise<boolean> {
    const [row] = await this.dataSource.query(
      `SELECT 1
       FROM aficionados
       WHERE numero_documento = ?
         AND NOT (id <=> ?)
       LIMIT 1`,
      [numeroDocumento, excludeId ?? null],
    );
    return Boolean(row);
  }

  async existsByEmail(correoElectronico: string, excludeId?: number): Promise<boolean> {
    const [row] = await this.dataSource.query(
      `SELECT 1
       FROM aficionados
       WHERE LOWER(TRIM(correo_electronico)) = LOWER(TRIM(?))
         AND NOT (id <=> ?)
       LIMIT 1`,
      [correoElectronico, excludeId ?? null],
    );
    return Boolean(row);
  }

  // Comprobar si tiene boletos asociados antes de eliminar
  async hasBoletos(id: number): Promise<boolean> {
    const [row] = await this.dataSource.query(
      `SELECT 1 FROM boletos WHERE aficionado_id = ? LIMIT 1`,
      [id],
    );
    return Boolean(row);
  }
}

