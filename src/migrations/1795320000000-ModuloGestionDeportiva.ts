import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModuloGestionDeportiva1795320000000 implements MigrationInterface {
  name = 'ModuloGestionDeportiva1795320000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Agregar identificador único a jugadores
    await queryRunner.query(`
      ALTER TABLE \`jugadores\`
      ADD COLUMN \`identificacion\` varchar(30) NULL,
      ADD UNIQUE KEY \`UQ_jugadores_identificacion\` (\`identificacion\`)
    `);

    // 2. Crear tabla contratos para asignar jugadores a equipos (HU-GD-05)
    await queryRunner.query(`
      CREATE TABLE \`contratos\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`fecha_inicio\` date NOT NULL,
        \`fecha_fin\` date NULL,
        \`numero_camiseta\` int NULL,
        \`posicion\` varchar(50) NULL,
        \`salario\` decimal(12,2) NOT NULL DEFAULT 0.00,
        \`activo\` tinyint NOT NULL DEFAULT 1,
        \`jugador_id\` int NOT NULL,
        \`equipo_id\` int NOT NULL,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_contratos_jugador\`
          FOREIGN KEY (\`jugador_id\`) REFERENCES \`jugadores\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT \`FK_contratos_equipo\`
          FOREIGN KEY (\`equipo_id\`) REFERENCES \`equipos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`contratos\``);
    await queryRunner.query(`
      ALTER TABLE \`jugadores\`
      DROP KEY \`UQ_jugadores_identificacion\`,
      DROP COLUMN \`identificacion\`
    `);
  }
}
