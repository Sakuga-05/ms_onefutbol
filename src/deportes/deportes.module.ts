import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipoDeporte } from '../equipos-deportes/entities/equipo-deporte.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import { Deporte } from './entities/deporte.entity';
import { DeportesController } from './deportes.controller';
import { DeportesRepository } from './repositories/deportes.repository';
import { DeportesService } from './deportes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Deporte, EquipoDeporte, Torneo])],
  controllers: [DeportesController],
  providers: [DeportesService, DeportesRepository],
  exports: [DeportesService, DeportesRepository],
})
export class DeportesModule {}
