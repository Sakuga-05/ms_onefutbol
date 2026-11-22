import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeporteToTorneo1795310000000 implements MigrationInterface {
  name = 'AddDeporteToTorneo1795310000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`torneos\`
      ADD COLUMN \`deporte_id\` int NOT NULL,
      ADD CONSTRAINT \`FK_torneos_deporte\`
        FOREIGN KEY (\`deporte_id\`) REFERENCES \`deportes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`torneos\`
      DROP FOREIGN KEY \`FK_torneos_deporte\`,
      DROP COLUMN \`deporte_id\`
    `);
  }
}
