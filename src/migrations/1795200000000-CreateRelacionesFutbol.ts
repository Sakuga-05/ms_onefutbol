import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRelacionesFutbol1795200000000 implements MigrationInterface {
  name = 'CreateRelacionesFutbol1795200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`jugadores\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`nombres\` varchar(100) NOT NULL,
        \`apellidos\` varchar(100) NOT NULL,
        \`numero_camiseta\` int NOT NULL,
        \`nacionalidad\` varchar(50) NULL,
        \`activo\` tinyint NOT NULL DEFAULT 1,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`habilidades\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`nombre\` varchar(100) NOT NULL,
        \`descripcion\` text NULL,
        \`activa\` tinyint NOT NULL DEFAULT 1,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_habilidades_nombre\` (\`nombre\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`habilidades_jugadores\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`nivel\` int NOT NULL DEFAULT 1,
        \`fecha_registro\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`jugador_id\` int NOT NULL,
        \`habilidad_id\` int NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_habilidades_jugadores_jugador_habilidad\` (\`jugador_id\`, \`habilidad_id\`),
        CONSTRAINT \`FK_habilidades_jugadores_jugador\`
          FOREIGN KEY (\`jugador_id\`) REFERENCES \`jugadores\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT \`FK_habilidades_jugadores_habilidad\`
          FOREIGN KEY (\`habilidad_id\`) REFERENCES \`habilidades\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`pelotas\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`tipo\` varchar(50) NULL,
        \`estado\` varchar(30) NULL,
        \`partido_id\` int NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_pelotas_partido\` (\`partido_id\`),
        CONSTRAINT \`FK_pelotas_partido\`
          FOREIGN KEY (\`partido_id\`) REFERENCES \`partidos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`posiciones_espaciales\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`x\` decimal(10,2) NOT NULL,
        \`y\` decimal(10,2) NOT NULL,
        \`z\` decimal(10,2) NULL,
        \`momento\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`jugador_id\` int NOT NULL,
        \`pelota_id\` int NOT NULL,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_posiciones_espaciales_jugador\`
          FOREIGN KEY (\`jugador_id\`) REFERENCES \`jugadores\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT \`FK_posiciones_espaciales_pelota\`
          FOREIGN KEY (\`pelota_id\`) REFERENCES \`pelotas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`anotaciones\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`minuto\` int NOT NULL,
        \`tipo\` varchar(30) NOT NULL DEFAULT 'GOL',
        \`descripcion\` text NULL,
        \`partido_id\` int NOT NULL,
        \`jugador_id\` int NOT NULL,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_anotaciones_partido\`
          FOREIGN KEY (\`partido_id\`) REFERENCES \`partidos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT \`FK_anotaciones_jugador\`
          FOREIGN KEY (\`jugador_id\`) REFERENCES \`jugadores\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`aficionados_equipos\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`fecha_asociacion\` date NOT NULL,
        \`activo\` tinyint NOT NULL DEFAULT 1,
        \`aficionado_id\` int NOT NULL,
        \`equipo_id\` int NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_aficionados_equipos_aficionado_equipo\` (\`aficionado_id\`, \`equipo_id\`),
        CONSTRAINT \`FK_aficionados_equipos_aficionado\`
          FOREIGN KEY (\`aficionado_id\`) REFERENCES \`aficionados\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT \`FK_aficionados_equipos_equipo\`
          FOREIGN KEY (\`equipo_id\`) REFERENCES \`equipos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `aficionados_equipos`');
    await queryRunner.query('DROP TABLE `anotaciones`');
    await queryRunner.query('DROP TABLE `posiciones_espaciales`');
    await queryRunner.query('DROP TABLE `pelotas`');
    await queryRunner.query('DROP TABLE `habilidades_jugadores`');
    await queryRunner.query('DROP TABLE `habilidades`');
    await queryRunner.query('DROP TABLE `jugadores`');
  }
}
