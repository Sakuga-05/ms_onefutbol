import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTorneoEntidades1795100000000 implements MigrationInterface {
  name = 'CreateTorneoEntidades1795100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`escenarios\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`nombre\` varchar(120) NOT NULL,
        \`descripcion\` text NULL,
        \`ubicacion\` varchar(150) NOT NULL,
        \`capacidad\` int NOT NULL DEFAULT 0,
        \`activo\` tinyint NOT NULL DEFAULT 1,
        \`escenario_padre_id\` int NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_escenarios_nombre\` (\`nombre\`),
        CONSTRAINT \`FK_escenarios_escenario_padre\`
          FOREIGN KEY (\`escenario_padre_id\`) REFERENCES \`escenarios\`(\`id\`)
          ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`localidades\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`nombre\` varchar(100) NOT NULL,
        \`descripcion\` text NULL,
        \`capacidad\` int NOT NULL,
        \`precio_base\` decimal(10,2) NOT NULL DEFAULT 0.00,
        \`activa\` tinyint NOT NULL DEFAULT 1,
        \`escenario_id\` int NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_localidad_escenario_nombre\` (\`escenario_id\`, \`nombre\`),
        CONSTRAINT \`FK_localidades_escenario\`
          FOREIGN KEY (\`escenario_id\`) REFERENCES \`escenarios\`(\`id\`)
          ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`aficionados\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`nombres\` varchar(100) NOT NULL,
        \`apellidos\` varchar(100) NOT NULL,
        \`tipo_documento\` varchar(20) NOT NULL,
        \`numero_documento\` varchar(30) NOT NULL,
        \`correo_electronico\` varchar(150) NOT NULL,
        \`telefono\` varchar(30) NOT NULL,
        \`activo\` tinyint NOT NULL DEFAULT 1,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_aficionados_numero_documento\` (\`numero_documento\`),
        UNIQUE KEY \`UQ_aficionados_correo_electronico\` (\`correo_electronico\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`partidos\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`fecha_hora\` datetime NOT NULL,
        \`estado\` varchar(30) NOT NULL DEFAULT 'PROGRAMADO',
        \`descripcion\` text NULL,
        \`escenario_id\` int NOT NULL,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_partidos_escenario\`
          FOREIGN KEY (\`escenario_id\`) REFERENCES \`escenarios\`(\`id\`)
          ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`boletos\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`codigo\` varchar(50) NOT NULL,
        \`fecha_compra\` datetime NOT NULL,
        \`precio\` decimal(10,2) NOT NULL,
        \`estado\` varchar(30) NOT NULL DEFAULT 'COMPRADO',
        \`asiento\` varchar(20) NULL,
        \`aficionado_id\` int NOT NULL,
        \`partido_id\` int NOT NULL,
        \`localidad_id\` int NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_boletos_codigo\` (\`codigo\`),
        CONSTRAINT \`FK_boletos_aficionado\`
          FOREIGN KEY (\`aficionado_id\`) REFERENCES \`aficionados\`(\`id\`)
          ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT \`FK_boletos_partido\`
          FOREIGN KEY (\`partido_id\`) REFERENCES \`partidos\`(\`id\`)
          ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT \`FK_boletos_localidad\`
          FOREIGN KEY (\`localidad_id\`) REFERENCES \`localidades\`(\`id\`)
          ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `boletos`');
    await queryRunner.query('DROP TABLE `partidos`');
    await queryRunner.query('DROP TABLE `aficionados`');
    await queryRunner.query('DROP TABLE `localidades`');
    await queryRunner.query('DROP TABLE `escenarios`');
  }
}

