import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contrato } from '../contratos/entities/contrato.entity';
import { EquipoDeporte } from '../equipos-deportes/entities/equipo-deporte.entity';
import { Equipo } from './entities/equipo.entity';
import { EquiposController } from './equipos.controller';
import { EquiposRepository } from './repositories/equipos.repository';
import { EquiposService } from './equipos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Equipo, EquipoDeporte, Contrato])],
  controllers: [EquiposController],
  providers: [EquiposService, EquiposRepository],
  exports: [EquiposService, EquiposRepository],
})
export class EquiposModule {}
