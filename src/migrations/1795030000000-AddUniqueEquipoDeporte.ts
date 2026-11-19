import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueEquipoDeporte1795030000000 implements MigrationInterface {
  name = 'AddUniqueEquipoDeporte1795030000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const constraintName = 'UQ_equipos_deportes_equipo_deporte';
    const indexes = (await queryRunner.query(
      'SHOW INDEX FROM `equipos_deportes` WHERE `Key_name` = ?',
      [constraintName],
    )) as unknown[];
    if (indexes.length === 0) {
      await queryRunner.query(
        `ALTER TABLE \`equipos_deportes\` ADD CONSTRAINT \`${constraintName}\` UNIQUE (\`equipo_id\`, \`deporte_id\`)`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const constraintName = 'UQ_equipos_deportes_equipo_deporte';
    const indexes = (await queryRunner.query(
      'SHOW INDEX FROM `equipos_deportes` WHERE `Key_name` = ?',
      [constraintName],
    )) as unknown[];
    if (indexes.length > 0) {
      await queryRunner.dropIndex('equipos_deportes', constraintName);
    }
  }
}
