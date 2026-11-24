import { MigrationInterface, QueryRunner } from 'typeorm';

export class RequireJugadorIdentificationAndNationality1795495000000
  implements MigrationInterface
{
  name = 'RequireJugadorIdentificationAndNationality1795495000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const [nullCounts] = await queryRunner.query(`
      SELECT
        COUNT(CASE WHEN \`identificacion\` IS NULL THEN 1 END) AS \`identificaciones_nulas\`,
        COUNT(CASE WHEN \`nacionalidad\` IS NULL THEN 1 END) AS \`nacionalidades_nulas\`
      FROM \`jugadores\`
    `);

    const identificacionesNulas = Number(nullCounts.identificaciones_nulas);
    const nacionalidadesNulas = Number(nullCounts.nacionalidades_nulas);
    if (identificacionesNulas > 0 || nacionalidadesNulas > 0) {
      throw new Error(
        `No se puede hacer obligatorios identificacion y nacionalidad: hay ${identificacionesNulas} jugador(es) sin identificacion y ${nacionalidadesNulas} sin nacionalidad. Completa esos datos y vuelve a ejecutar la migracion.`,
      );
    }

    await queryRunner.query(`
      ALTER TABLE \`jugadores\`
      MODIFY COLUMN \`identificacion\` varchar(30) NOT NULL,
      MODIFY COLUMN \`nacionalidad\` varchar(50) NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`jugadores\`
      MODIFY COLUMN \`identificacion\` varchar(30) NULL,
      MODIFY COLUMN \`nacionalidad\` varchar(50) NULL
    `);
  }
}
