import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jugador } from '../jugadores/entities/jugador.entity';
import { Partido } from '../partidos/entities/partido.entity';
import { Anotacion } from './entities/anotacion.entity';
import { AnotacionesRepository } from './repositories/anotaciones.repository';
import { AnotacionesController } from './anotaciones.controller';
import { AnotacionesService } from './anotaciones.service';

@Module({
  imports: [TypeOrmModule.forFeature([Anotacion, Partido, Jugador])],
  controllers: [AnotacionesController],
  providers: [AnotacionesService, AnotacionesRepository],
  exports: [TypeOrmModule, AnotacionesRepository],
})
export class AnotacionesModule {}
