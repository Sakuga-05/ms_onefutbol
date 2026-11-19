import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AficionadosModule } from './aficionados/aficionados.module';
import { ApuestasModule } from './apuestas/apuestas.module';
import { BoletosModule } from './boletos/boletos.module';
import { DeportesModule } from './deportes/deportes.module';
import { EquiposDeportesModule } from './equipos-deportes/equipos-deportes.module';
import { EquiposModule } from './equipos/equipos.module';
import { EscenariosModule } from './escenarios/escenarios.module';
import { LocalidadesModule } from './localidades/localidades.module';
import { MetodosPagoAficionadosModule } from './metodos-pago-aficionados/metodos-pago-aficionados.module';
import { MetodosPagoModule } from './metodos-pago/metodos-pago.module';
import { PartidosModule } from './partidos/partidos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
    }),
    DeportesModule,
    EquiposModule,
    EquiposDeportesModule,
    EscenariosModule,
    LocalidadesModule,
    AficionadosModule,
    PartidosModule,
    BoletosModule,
    MetodosPagoModule,
    MetodosPagoAficionadosModule,
    ApuestasModule,
  ],
})
export class AppModule {}
