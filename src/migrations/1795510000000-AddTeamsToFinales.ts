import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTeamsToFinales1795510000000 implements MigrationInterface {
  name = 'AddTeamsToFinales1795510000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`finales_equipos\` (
        \`final_id\` int NOT NULL,
        \`equipo_id\` int NOT NULL,
        PRIMARY KEY (\`final_id\`, \`equipo_id\`),
        KEY \`IDX_finales_equipos_equipo_id\` (\`equipo_id\`),
        CONSTRAINT \`FK_finales_equipos_final\`
          FOREIGN KEY (\`final_id\`) REFERENCES \`finales\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`FK_finales_equipos_equipo\`
          FOREIGN KEY (\`equipo_id\`) REFERENCES \`equipos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `finales_equipos`');
  }
}
