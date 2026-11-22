import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Torneo } from '../torneos/entities/torneo.entity';
import { Fase } from './entities/fase.entity';
import { FasesController } from './fases.controller';
import { FasesRepository } from './repositories/fases.repository';
import { FasesService } from './fases.service';

@Module({
  imports: [TypeOrmModule.forFeature([Fase, Torneo])],
  controllers: [FasesController],
  providers: [FasesService, FasesRepository],
  exports: [FasesService, FasesRepository],
})
export class FasesModule {}
