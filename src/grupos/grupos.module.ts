import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipo } from '../equipos/entities/equipo.entity';
import { Fase } from '../fases/entities/fase.entity';
import { Grupo } from './entities/grupo.entity';
import { GruposController } from './grupos.controller';
import { GruposRepository } from './repositories/grupos.repository';
import { GruposService } from './grupos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Grupo, Fase, Equipo])],
  controllers: [GruposController],
  providers: [GruposService, GruposRepository],
  exports: [GruposService, GruposRepository],
})
export class GruposModule {}
