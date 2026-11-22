import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partido } from '../partidos/entities/partido.entity';
import { Pelota } from './entities/pelota.entity';
import { PelotasRepository } from './repositories/pelotas.repository';
import { PelotasController } from './pelotas.controller';
import { PelotasService } from './pelotas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pelota, Partido])],
  controllers: [PelotasController],
  providers: [PelotasService, PelotasRepository],
  exports: [TypeOrmModule, PelotasRepository],
})
export class PelotasModule {}
