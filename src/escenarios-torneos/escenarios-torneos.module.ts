import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Escenario } from '../escenarios/entities/escenario.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import { EscenarioTorneo } from './entities/escenario-torneo.entity';
import { EscenariosTorneosController } from './escenarios-torneos.controller';
import { EscenariosTorneosRepository } from './repositories/escenarios-torneos.repository';
import { EscenariosTorneosService } from './escenarios-torneos.service';

@Module({
  imports: [TypeOrmModule.forFeature([EscenarioTorneo, Escenario, Torneo])],
  controllers: [EscenariosTorneosController],
  providers: [EscenariosTorneosService, EscenariosTorneosRepository],
  exports: [EscenariosTorneosService, EscenariosTorneosRepository],
})
export class EscenariosTorneosModule {}
