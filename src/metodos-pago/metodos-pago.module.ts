import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetodoPago } from './entities/metodo-pago.entity';
import { MetodosPagoController } from './metodos-pago.controller';
import { MetodosPagoRepository } from './repositories/metodos-pago.repository';
import { MetodosPagoService } from './metodos-pago.service';

@Module({
  imports: [TypeOrmModule.forFeature([MetodoPago])],
  controllers: [MetodosPagoController],
  providers: [MetodosPagoService, MetodosPagoRepository],
  exports: [MetodosPagoService, MetodosPagoRepository],
})
export class MetodosPagoModule {}

