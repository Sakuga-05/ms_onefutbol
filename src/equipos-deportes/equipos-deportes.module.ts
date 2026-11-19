import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deporte } from '../deportes/entities/deporte.entity';
import { Equipo } from '../equipos/entities/equipo.entity';
import { EquipoDeporte } from './entities/equipo-deporte.entity';
import { EquiposDeportesController } from './equipos-deportes.controller';
import { EquiposDeportesRepository } from './repositories/equipos-deportes.repository';
import { EquiposDeportesService } from './equipos-deportes.service';

@Module({
  imports: [TypeOrmModule.forFeature([EquipoDeporte, Equipo, Deporte])],
  controllers: [EquiposDeportesController],
  providers: [EquiposDeportesService, EquiposDeportesRepository],
})
export class EquiposDeportesModule {}
