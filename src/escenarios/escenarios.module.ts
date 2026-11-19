import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Escenario } from './entities/escenario.entity';
import { EscenariosController } from './escenarios.controller';
import { EscenariosRepository } from './repositories/escenarios.repository';
import { EscenariosService } from './escenarios.service';

@Module({
  imports: [TypeOrmModule.forFeature([Escenario])],
  controllers: [EscenariosController],
  providers: [EscenariosService, EscenariosRepository],
  exports: [EscenariosService, EscenariosRepository],
})
export class EscenariosModule {}

