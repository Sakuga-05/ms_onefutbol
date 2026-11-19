import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateApuestasMetodosPago1795110000000 implements MigrationInterface {
  name = 'CreateApuestasMetodosPago1795110000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`metodos_pago\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`nombre\` varchar(80) NOT NULL,
        \`descripcion\` text NULL,
        \`activo\` tinyint NOT NULL DEFAULT 1,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_metodos_pago_nombre\` (\`nombre\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`metodos_pago_aficionados\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`alias\` varchar(100) NOT NULL,
        \`detalles\` varchar(255) NULL,
        \`activo\` tinyint NOT NULL DEFAULT 1,
        \`fecha_registro\` datetime NOT NULL,
        \`aficionado_id\` int NOT NULL,
        \`metodo_pago_id\` int NOT NULL,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_metodos_pago_aficionados_aficionado\`
          FOREIGN KEY (\`aficionado_id\`) REFERENCES \`aficionados\`(\`id\`)
          ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT \`FK_metodos_pago_aficionados_metodo_pago\`
          FOREIGN KEY (\`metodo_pago_id\`) REFERENCES \`metodos_pago\`(\`id\`)
          ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`apuestas\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`monto\` decimal(10,2) NOT NULL,
        \`cuota\` decimal(5,2) NOT NULL,
        \`pronostico\` varchar(50) NOT NULL,
        \`ganancia_potencial\` decimal(10,2) NOT NULL,
        \`estado\` varchar(30) NOT NULL DEFAULT 'PENDIENTE',
        \`fecha_hora\` datetime NOT NULL,
        \`aficionado_id\` int NOT NULL,
        \`partido_id\` int NOT NULL,
        \`metodo_pago_aficionado_id\` int NOT NULL,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_apuestas_aficionado\`
          FOREIGN KEY (\`aficionado_id\`) REFERENCES \`aficionados\`(\`id\`)
          ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT \`FK_apuestas_partido\`
          FOREIGN KEY (\`partido_id\`) REFERENCES \`partidos\`(\`id\`)
          ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT \`FK_apuestas_metodo_pago_aficionado\`
          FOREIGN KEY (\`metodo_pago_aficionado_id\`) REFERENCES \`metodos_pago_aficionados\`(\`id\`)
          ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `apuestas`');
    await queryRunner.query('DROP TABLE `metodos_pago_aficionados`');
    await queryRunner.query('DROP TABLE `metodos_pago`');
  }
}

