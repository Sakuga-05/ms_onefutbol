import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class JugadoresRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async hasAnotaciones(id: number): Promise<boolean> {
    const [row] = await this.dataSource.query('SELECT 1 FROM anotaciones WHERE jugador_id = ? LIMIT 1', [id]);
    return Boolean(row);
  }
}
