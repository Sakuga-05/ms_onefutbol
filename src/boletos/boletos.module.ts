import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aficionado } from '../aficionados/entities/aficionado.entity';
import { Localidad } from '../localidades/entities/localidad.entity';
import { Partido } from '../partidos/entities/partido.entity';
import { Boleto } from './entities/boleto.entity';
import { BoletosController } from './boletos.controller';
import { BoletosRepository } from './repositories/boletos.repository';
import { BoletosService } from './boletos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Boleto, Aficionado, Partido, Localidad])],
  controllers: [BoletosController],
  providers: [BoletosService, BoletosRepository],
  exports: [BoletosService, BoletosRepository],
})
export class BoletosModule {}

