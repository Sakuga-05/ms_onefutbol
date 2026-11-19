import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Escenario } from '../escenarios/entities/escenario.entity';
import { Partido } from './entities/partido.entity';
import { PartidosController } from './partidos.controller';
import { PartidosRepository } from './repositories/partidos.repository';
import { PartidosService } from './partidos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Partido, Escenario])],
  controllers: [PartidosController],
  providers: [PartidosService, PartidosRepository],
  exports: [PartidosService, PartidosRepository],
})
export class PartidosModule {}

