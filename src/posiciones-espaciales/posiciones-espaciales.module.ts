import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jugador } from '../jugadores/entities/jugador.entity';
import { Pelota } from '../pelotas/entities/pelota.entity';
import { PosicionEspacial } from './entities/posicion-espacial.entity';
import { PosicionesEspacialesRepository } from './repositories/posiciones-espaciales.repository';
import { PosicionesEspacialesController } from './posiciones-espaciales.controller';
import { PosicionesEspacialesService } from './posiciones-espaciales.service';

@Module({
  imports: [TypeOrmModule.forFeature([PosicionEspacial, Jugador, Pelota])],
  controllers: [PosicionesEspacialesController],
  providers: [PosicionesEspacialesService, PosicionesEspacialesRepository],
  exports: [TypeOrmModule, PosicionesEspacialesRepository],
})
export class PosicionesEspacialesModule {}
