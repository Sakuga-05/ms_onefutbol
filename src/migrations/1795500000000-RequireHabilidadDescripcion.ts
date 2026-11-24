import { MigrationInterface, QueryRunner } from 'typeorm';

export class RequireHabilidadDescripcion1795500000000
  implements MigrationInterface
{
  name = 'RequireHabilidadDescripcion1795500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const [result] = await queryRunner.query(`
      SELECT COUNT(*) AS \`descripciones_nulas\`
      FROM \`habilidades\`
      WHERE \`descripcion\` IS NULL
    `);

    if (Number(result.descripciones_nulas) > 0) {
      throw new Error(
        'No se puede hacer obligatoria la descripcion de habilidades: existen registros sin descripcion. Completa esos datos y vuelve a ejecutar la migracion.',
      );
    }

    await queryRunner.query(`
      ALTER TABLE \`habilidades\`
      MODIFY COLUMN \`descripcion\` text NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`habilidades\`
      MODIFY COLUMN \`descripcion\` text NULL
    `);
  }
}
