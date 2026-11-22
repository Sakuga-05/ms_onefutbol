import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipo } from '../equipos/entities/equipo.entity';
import { Jugador } from '../jugadores/entities/jugador.entity';
import { ContratosController } from './contratos.controller';
import { ContratosService } from './contratos.service';
import { Contrato } from './entities/contrato.entity';
import { ContratosRepository } from './repositories/contratos.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Contrato, Jugador, Equipo])],
  controllers: [ContratosController],
  providers: [ContratosService, ContratosRepository],
  exports: [ContratosService, ContratosRepository],
})
export class ContratosModule {}
