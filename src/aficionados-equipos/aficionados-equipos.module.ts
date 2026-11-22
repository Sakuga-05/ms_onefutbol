import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aficionado } from '../aficionados/entities/aficionado.entity';
import { Equipo } from '../equipos/entities/equipo.entity';
import { AficionadoEquipo } from './entities/aficionado-equipo.entity';
import { AficionadosEquiposRepository } from './repositories/aficionados-equipos.repository';
import { AficionadosEquiposController } from './aficionados-equipos.controller';
import { AficionadosEquiposService } from './aficionados-equipos.service';

@Module({
  imports: [TypeOrmModule.forFeature([AficionadoEquipo, Aficionado, Equipo])],
  controllers: [AficionadosEquiposController],
  providers: [AficionadosEquiposService, AficionadosEquiposRepository],
  exports: [TypeOrmModule, AficionadosEquiposRepository],
})
export class AficionadosEquiposModule {}
