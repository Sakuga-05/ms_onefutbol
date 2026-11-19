import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Aficionado } from '../../aficionados/entities/aficionado.entity';
import { Apuesta } from '../../apuestas/entities/apuesta.entity';
import { MetodoPago } from '../../metodos-pago/entities/metodo-pago.entity';

@Entity('metodos_pago_aficionados')
export class MetodoPagoAficionado {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  alias!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  detalles!: string | null;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  @Column({ name: 'fecha_registro', type: 'datetime' })
  fechaRegistro!: Date;

  // Pertenece a un único Aficionado (N:1)
  @ManyToOne(() => Aficionado, (aficionado) => aficionado.metodosPago, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'aficionado_id' })
  aficionado!: Aficionado;

  // Pertenece a un único Método de Pago base (N:1)
  @ManyToOne(
    () => MetodoPago,
    (metodoPago) => metodoPago.metodosAficionados,
    {
      nullable: false,
      onDelete: 'NO ACTION',
    },
  )
  @JoinColumn({ name: 'metodo_pago_id' })
  metodoPago!: MetodoPago;

  // Un método de pago de un aficionado puede respaldar muchas apuestas (1:N)
  @OneToMany(() => Apuesta, (apuesta) => apuesta.metodoPagoAficionado)
  apuestas?: Apuesta[];
}

