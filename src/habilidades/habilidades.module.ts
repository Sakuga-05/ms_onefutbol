import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habilidad } from './entities/habilidad.entity';
import { HabilidadesRepository } from './repositories/habilidades.repository';
import { HabilidadesController } from './habilidades.controller';
import { HabilidadesService } from './habilidades.service';

@Module({
  imports: [TypeOrmModule.forFeature([Habilidad])],
  controllers: [HabilidadesController],
  providers: [HabilidadesService, HabilidadesRepository],
  exports: [TypeOrmModule, HabilidadesRepository],
})
export class HabilidadesModule {}
