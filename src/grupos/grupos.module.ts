import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fase } from '../fases/entities/fase.entity';
import { Grupo } from './entities/grupo.entity';
import { GruposController } from './grupos.controller';
import { GruposRepository } from './repositories/grupos.repository';
import { GruposService } from './grupos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Grupo, Fase])],
  controllers: [GruposController],
  providers: [GruposService, GruposRepository],
  exports: [GruposService, GruposRepository],
})
export class GruposModule {}
