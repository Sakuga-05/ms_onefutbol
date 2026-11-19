import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipoDeporte } from '../equipos-deportes/entities/equipo-deporte.entity';
import { Equipo } from './entities/equipo.entity';
import { EquiposController } from './equipos.controller';
import { EquiposService } from './equipos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Equipo, EquipoDeporte])],
  controllers: [EquiposController],
  providers: [EquiposService],
})
export class EquiposModule {}
