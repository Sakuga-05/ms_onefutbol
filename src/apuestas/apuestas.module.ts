import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aficionado } from '../aficionados/entities/aficionado.entity';
import { MetodoPagoAficionado } from '../metodos-pago-aficionados/entities/metodo-pago-aficionado.entity';
import { Partido } from '../partidos/entities/partido.entity';
import { Apuesta } from './entities/apuesta.entity';
import { ApuestasController } from './apuestas.controller';
import { ApuestasRepository } from './repositories/apuestas.repository';
import { ApuestasService } from './apuestas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Apuesta,
      Aficionado,
      Partido,
      MetodoPagoAficionado,
    ]),
  ],
  controllers: [ApuestasController],
  providers: [ApuestasService, ApuestasRepository],
  exports: [ApuestasService, ApuestasRepository],
})
export class ApuestasModule {}

