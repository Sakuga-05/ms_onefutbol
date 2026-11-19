import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Aficionado } from '../../aficionados/entities/aficionado.entity';
import { MetodoPagoAficionado } from '../../metodos-pago-aficionados/entities/metodo-pago-aficionado.entity';
import { Partido } from '../../partidos/entities/partido.entity';

@Entity('apuestas')
export class Apuesta {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  cuota!: number;

  @Column({ length: 50 })
  pronostico!: string;

  @Column({ name: 'ganancia_potencial', type: 'decimal', precision: 10, scale: 2 })
  gananciaPotencial!: number;

  @Column({ length: 30, default: 'PENDIENTE' })
  estado!: string;

  @Column({ name: 'fecha_hora', type: 'datetime' })
  fechaHora!: Date;

  // Resuelve la relación N:M con Aficionado (N:1)
  @ManyToOne(() => Aficionado, (aficionado) => aficionado.apuestas, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'aficionado_id' })
  aficionado!: Aficionado;

  // Resuelve la relación N:M con Partido (N:1)
  @ManyToOne(() => Partido, (partido) => partido.apuestas, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'partido_id' })
  partido!: Partido;

  // Relación con el método de pago registrado por el aficionado (N:1)
  @ManyToOne(
    () => MetodoPagoAficionado,
    (metodoAficionado) => metodoAficionado.apuestas,
    {
      nullable: false,
      onDelete: 'NO ACTION',
    },
  )
  @JoinColumn({ name: 'metodo_pago_aficionado_id' })
  metodoPagoAficionado!: MetodoPagoAficionado;
}

