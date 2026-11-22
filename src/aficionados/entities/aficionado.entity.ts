import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Boleto } from '../../boletos/entities/boleto.entity';
import { MetodoPagoAficionado } from '../../metodos-pago-aficionados/entities/metodo-pago-aficionado.entity';
import { Apuesta } from '../../apuestas/entities/apuesta.entity';
import { AficionadoEquipo } from '../../aficionados-equipos/entities/aficionado-equipo.entity';

@Entity('aficionados')
export class Aficionado {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nombres!: string;

  @Column({ length: 100 })
  apellidos!: string;

  @Column({ name: 'tipo_documento', length: 20 })
  tipoDocumento!: string;

  @Column({ name: 'numero_documento', length: 30, unique: true })
  numeroDocumento!: string;

  @Column({ name: 'correo_electronico', length: 150, unique: true })
  correoElectronico!: string;

  @Column({ length: 30 })
  telefono!: string;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  // Un Aficionado puede tener varios Boletos (1:N)
  @OneToMany(() => Boleto, (boleto) => boleto.aficionado)
  boletos?: Boleto[];

  // Un Aficionado puede registrar varios Métodos de Pago (1:N)
  @OneToMany(
    () => MetodoPagoAficionado,
    (metodoAficionado) => metodoAficionado.aficionado,
  )
  metodosPago?: MetodoPagoAficionado[];

  // Un Aficionado puede realizar varias Apuestas (1:N)
  @OneToMany(() => Apuesta, (apuesta) => apuesta.aficionado)
  apuestas?: Apuesta[];

  @OneToMany(
    () => AficionadoEquipo,
    (aficionadoEquipo) => aficionadoEquipo.aficionado,
  )
  equipos?: AficionadoEquipo[];
}
