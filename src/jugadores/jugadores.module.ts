import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jugador } from './entities/jugador.entity';
import { JugadoresRepository } from './repositories/jugadores.repository';
import { JugadoresController } from './jugadores.controller';
import { JugadoresService } from './jugadores.service';

@Module({
  imports: [TypeOrmModule.forFeature([Jugador])],
  controllers: [JugadoresController],
  providers: [JugadoresService, JugadoresRepository],
  exports: [TypeOrmModule, JugadoresRepository],
})
export class JugadoresModule {}
