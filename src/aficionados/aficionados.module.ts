import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aficionado } from './entities/aficionado.entity';
import { AficionadosController } from './aficionados.controller';
import { AficionadosRepository } from './repositories/aficionados.repository';
import { AficionadosService } from './aficionados.service';

@Module({
  imports: [TypeOrmModule.forFeature([Aficionado])],
  controllers: [AficionadosController],
  providers: [AficionadosService, AficionadosRepository],
  exports: [AficionadosService, AficionadosRepository],
})
export class AficionadosModule {}

