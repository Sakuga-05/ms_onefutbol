import { MigrationInterface, QueryRunner } from 'typeorm';

export class CompletarGestionTorneos1795400000000 implements MigrationInterface {
  name = 'CompletarGestionTorneos1795400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `partidos` ADD COLUMN `equipo_local_id` int NULL');
    await queryRunner.query('ALTER TABLE `partidos` ADD COLUMN `equipo_visitante_id` int NULL');
    await queryRunner.query('ALTER TABLE `partidos` ADD COLUMN `goles_local` int NULL');
    await queryRunner.query('ALTER TABLE `partidos` ADD COLUMN `goles_visitante` int NULL');
    await queryRunner.query('ALTER TABLE `partidos` ADD CONSTRAINT `FK_partidos_equipo_local` FOREIGN KEY (`equipo_local_id`) REFERENCES `equipos`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE `partidos` ADD CONSTRAINT `FK_partidos_equipo_visitante` FOREIGN KEY (`equipo_visitante_id`) REFERENCES `equipos`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `partidos` DROP FOREIGN KEY `FK_partidos_equipo_visitante`, DROP FOREIGN KEY `FK_partidos_equipo_local`');
    await queryRunner.query('ALTER TABLE `partidos` DROP COLUMN `goles_visitante`, DROP COLUMN `goles_local`, DROP COLUMN `equipo_visitante_id`, DROP COLUMN `equipo_local_id`');
  }
}
