import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DeportesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async existsByName(nombre: string, excludeId?: number): Promise<boolean> {
    const [row] = await this.dataSource.query(
      `SELECT 1
       FROM deportes
       WHERE TRIM(REGEXP_REPLACE(nombre, '[[:space:]]+', ' ')) COLLATE utf8mb4_general_ci =
             TRIM(REGEXP_REPLACE(?, '[[:space:]]+', ' ')) COLLATE utf8mb4_general_ci
         AND NOT (id <=> ?)
       LIMIT 1`,
      [nombre, excludeId ?? null],
    );
    return Boolean(row);
  }
}
