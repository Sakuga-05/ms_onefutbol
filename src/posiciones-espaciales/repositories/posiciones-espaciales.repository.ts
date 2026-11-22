import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
@Injectable()
export class PosicionesEspacialesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async findLastByPlayer(jugadorId: number): Promise<Record<string, unknown> | undefined> {
    const [row] = await this.dataSource.query(
      'SELECT * FROM posiciones_espaciales WHERE jugador_id = ? ORDER BY momento DESC, id DESC LIMIT 1',
      [jugadorId],
    );
    return row;
  }
}
