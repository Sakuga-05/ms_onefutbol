import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueDeporteNombre1795050000000 implements MigrationInterface {
  name = 'AddUniqueDeporteNombre1795050000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const indexName = 'UQ_deportes_nombre';
    const indexes = (await queryRunner.query(
      'SHOW INDEX FROM `deportes` WHERE `Key_name` = ?',
      [indexName],
    )) as unknown[];
    if (indexes.length === 0) {
      await queryRunner.query(
        `ALTER TABLE \`deportes\` ADD CONSTRAINT \`${indexName}\` UNIQUE (\`nombre\`)`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const indexName = 'UQ_deportes_nombre';
    const indexes = (await queryRunner.query(
      'SHOW INDEX FROM `deportes` WHERE `Key_name` = ?',
      [indexName],
    )) as unknown[];
    if (indexes.length > 0) {
      await queryRunner.dropIndex('deportes', indexName);
    }
  }
}
