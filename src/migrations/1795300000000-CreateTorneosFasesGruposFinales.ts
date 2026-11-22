import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTorneosFasesGruposFinales1795300000000 implements MigrationInterface {
  name = 'CreateTorneosFasesGruposFinales1795300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Torneos
    await queryRunner.query(`
      CREATE TABLE \`torneos\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`nombre\` varchar(120) NOT NULL,
        \`edicion\` varchar(50) NOT NULL,
        \`fecha_inicio\` date NOT NULL,
        \`fecha_fin\` date NULL,
        \`premio\` decimal(12,2) NOT NULL DEFAULT 0.00,
        \`activo\` tinyint NOT NULL DEFAULT 1,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_torneos_nombre\` (\`nombre\`)
      ) ENGINE=InnoDB
    `);

    // 2. Inscripciones (Torneo N:M Equipo)
    await queryRunner.query(`
      CREATE TABLE \`inscripciones\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`fecha_inscripcion\` date NOT NULL,
        \`numero_registro\` varchar(50) NOT NULL,
        \`costo\` decimal(10,2) NOT NULL DEFAULT 0.00,
        \`estado\` varchar(30) NOT NULL DEFAULT 'CONFIRMADA',
        \`torneo_id\` int NOT NULL,
        \`equipo_id\` int NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_inscripciones_numero_registro\` (\`numero_registro\`),
        UNIQUE KEY \`UQ_inscripciones_torneo_equipo\` (\`torneo_id\`, \`equipo_id\`),
        CONSTRAINT \`FK_inscripciones_torneo\`
          FOREIGN KEY (\`torneo_id\`) REFERENCES \`torneos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT \`FK_inscripciones_equipo\`
          FOREIGN KEY (\`equipo_id\`) REFERENCES \`equipos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    // 3. EscenariosTorneos (Escenario N:M Torneo)
    await queryRunner.query(`
      CREATE TABLE \`escenarios_torneos\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`fecha_asignacion\` date NOT NULL,
        \`es_principal\` tinyint NOT NULL DEFAULT 0,
        \`activo\` tinyint NOT NULL DEFAULT 1,
        \`escenario_id\` int NOT NULL,
        \`torneo_id\` int NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_escenarios_torneos_escenario_torneo\` (\`escenario_id\`, \`torneo_id\`),
        CONSTRAINT \`FK_escenarios_torneos_escenario\`
          FOREIGN KEY (\`escenario_id\`) REFERENCES \`escenarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT \`FK_escenarios_torneos_torneo\`
          FOREIGN KEY (\`torneo_id\`) REFERENCES \`torneos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    // 4. Fases (Torneo 1:N Fase)
    await queryRunner.query(`
      CREATE TABLE \`fases\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`nombre\` varchar(100) NOT NULL,
        \`orden\` int NOT NULL DEFAULT 1,
        \`tipo\` varchar(50) NOT NULL DEFAULT 'GRUPOS',
        \`activa\` tinyint NOT NULL DEFAULT 1,
        \`torneo_id\` int NOT NULL,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_fases_torneo\`
          FOREIGN KEY (\`torneo_id\`) REFERENCES \`torneos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    // 5. Grupos (Fase 1:N Grupo)
    await queryRunner.query(`
      CREATE TABLE \`grupos\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`nombre\` varchar(50) NOT NULL,
        \`descripcion\` text NULL,
        \`activo\` tinyint NOT NULL DEFAULT 1,
        \`fase_id\` int NOT NULL,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_grupos_fase\`
          FOREIGN KEY (\`fase_id\`) REFERENCES \`fases\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    // 6. Finales (Fase 1:1 Final)
    await queryRunner.query(`
      CREATE TABLE \`finales\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`premio_campeon\` decimal(12,2) NOT NULL DEFAULT 0.00,
        \`premio_subcampeon\` decimal(12,2) NOT NULL DEFAULT 0.00,
        \`tiempo_extra\` tinyint NOT NULL DEFAULT 1,
        \`definicion_penales\` tinyint NOT NULL DEFAULT 1,
        \`trofeo_nombre\` varchar(100) NOT NULL,
        \`reglas_especificas\` text NULL,
        \`fase_id\` int NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_finales_fase\` (\`fase_id\`),
        CONSTRAINT \`FK_finales_fase\`
          FOREIGN KEY (\`fase_id\`) REFERENCES \`fases\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    // 7. Modificar equipos para agregar grupo_id (Grupo 1:N Equipo)
    await queryRunner.query(`
      ALTER TABLE \`equipos\`
      ADD COLUMN \`grupo_id\` int NULL,
      ADD CONSTRAINT \`FK_equipos_grupo\`
        FOREIGN KEY (\`grupo_id\`) REFERENCES \`grupos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // 8. Modificar partidos para agregar fase_id (Fase 1:N Partido)
    await queryRunner.query(`
      ALTER TABLE \`partidos\`
      ADD COLUMN \`fase_id\` int NULL,
      ADD CONSTRAINT \`FK_partidos_fase\`
        FOREIGN KEY (\`fase_id\`) REFERENCES \`fases\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `partidos` DROP FOREIGN KEY `FK_partidos_fase`, DROP COLUMN `fase_id`');
    await queryRunner.query('ALTER TABLE `equipos` DROP FOREIGN KEY `FK_equipos_grupo`, DROP COLUMN `grupo_id`');
    await queryRunner.query('DROP TABLE `finales`');
    await queryRunner.query('DROP TABLE `grupos`');
    await queryRunner.query('DROP TABLE `fases`');
    await queryRunner.query('DROP TABLE `escenarios_torneos`');
    await queryRunner.query('DROP TABLE `inscripciones`');
    await queryRunner.query('DROP TABLE `torneos`');
  }
}
