import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habilidad } from '../habilidades/entities/habilidad.entity';
import { Jugador } from '../jugadores/entities/jugador.entity';
import { HabilidadJugador } from './entities/habilidad-jugador.entity';
import { HabilidadesJugadoresRepository } from './repositories/habilidades-jugadores.repository';
import { HabilidadesJugadoresController } from './habilidades-jugadores.controller';
import { HabilidadesJugadoresService } from './habilidades-jugadores.service';

@Module({
  imports: [TypeOrmModule.forFeature([HabilidadJugador, Jugador, Habilidad])],
  controllers: [HabilidadesJugadoresController],
  providers: [HabilidadesJugadoresService, HabilidadesJugadoresRepository],
  exports: [TypeOrmModule, HabilidadesJugadoresRepository],
})
export class HabilidadesJugadoresModule {}
