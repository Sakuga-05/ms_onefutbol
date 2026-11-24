import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipo } from '../equipos/entities/equipo.entity';
import { Fase } from '../fases/entities/fase.entity';
import { Final } from './entities/final.entity';
import { FinalesController } from './finales.controller';
import { FinalesRepository } from './repositories/finales.repository';
import { FinalesService } from './finales.service';

@Module({
  imports: [TypeOrmModule.forFeature([Final, Fase, Equipo])],
  controllers: [FinalesController],
  providers: [FinalesService, FinalesRepository],
  exports: [FinalesService, FinalesRepository],
})
export class FinalesModule {}
