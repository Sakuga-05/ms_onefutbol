import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Escenario } from '../escenarios/entities/escenario.entity';
import { Localidad } from './entities/localidad.entity';
import { LocalidadesController } from './localidades.controller';
import { LocalidadesRepository } from './repositories/localidades.repository';
import { LocalidadesService } from './localidades.service';

@Module({
  imports: [TypeOrmModule.forFeature([Localidad, Escenario])],
  controllers: [LocalidadesController],
  providers: [LocalidadesService, LocalidadesRepository],
  exports: [LocalidadesService, LocalidadesRepository],
})
export class LocalidadesModule {}

