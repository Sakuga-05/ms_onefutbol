import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aficionado } from '../aficionados/entities/aficionado.entity';
import { MetodoPago } from '../metodos-pago/entities/metodo-pago.entity';
import { MetodoPagoAficionado } from './entities/metodo-pago-aficionado.entity';
import { MetodosPagoAficionadosController } from './metodos-pago-aficionados.controller';
import { MetodosPagoAficionadosRepository } from './repositories/metodos-pago-aficionados.repository';
import { MetodosPagoAficionadosService } from './metodos-pago-aficionados.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MetodoPagoAficionado,
      Aficionado,
      MetodoPago,
    ]),
  ],
  controllers: [MetodosPagoAficionadosController],
  providers: [
    MetodosPagoAficionadosService,
    MetodosPagoAficionadosRepository,
  ],
  exports: [
    MetodosPagoAficionadosService,
    MetodosPagoAficionadosRepository,
  ],
})
export class MetodosPagoAficionadosModule {}

