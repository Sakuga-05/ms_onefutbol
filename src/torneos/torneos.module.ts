import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deporte } from '../deportes/entities/deporte.entity';
import { Torneo } from './entities/torneo.entity';
import { TorneosController } from './torneos.controller';
import { TorneosRepository } from './repositories/torneos.repository';
import { TorneosService } from './torneos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Torneo, Deporte])],
  controllers: [TorneosController],
  providers: [TorneosService, TorneosRepository],
  exports: [TorneosService, TorneosRepository],
})
export class TorneosModule {}
