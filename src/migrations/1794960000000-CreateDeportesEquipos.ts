import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDeportesEquipos1794960000000 implements MigrationInterface {
  name = 'CreateDeportesEquipos1794960000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`deportes\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`nombre\` varchar(120) NOT NULL,
        \`descripcion\` text NULL,
        \`es_colectivo\` tinyint NOT NULL,
        \`min_jugadores\` int NOT NULL,
        \`max_jugadores\` int NOT NULL,
        \`activo\` tinyint NOT NULL DEFAULT 1,
        \`deporte_padre_id\` int NULL,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_deportes_deporte_padre\`
          FOREIGN KEY (\`deporte_padre_id\`) REFERENCES \`deportes\`(\`id\`)
          ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`equipos\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`nombre\` varchar(120) NOT NULL,
        \`siglas\` varchar(12) NOT NULL,
        \`fecha_fundacion\` date NOT NULL,
        \`ciudad\` varchar(120) NOT NULL,
        \`pais\` varchar(120) NOT NULL,
        \`escudo\` varchar(255) NULL,
        \`activo\` tinyint NOT NULL DEFAULT 1,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`equipos_deportes\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`fecha_inscripcion\` date NOT NULL,
        \`entrenador\` varchar(120) NULL,
        \`categoria\` varchar(80) NULL,
        \`equipo_id\` int NOT NULL,
        \`deporte_id\` int NOT NULL,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_equipos_deportes_equipo\`
          FOREIGN KEY (\`equipo_id\`) REFERENCES \`equipos\`(\`id\`)
          ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT \`FK_equipos_deportes_deporte\`
          FOREIGN KEY (\`deporte_id\`) REFERENCES \`deportes\`(\`id\`)
          ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `equipos_deportes`');
    await queryRunner.query('DROP TABLE `equipos`');
    await queryRunner.query('DROP TABLE `deportes`');
  }
}
