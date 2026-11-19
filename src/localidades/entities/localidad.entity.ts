import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Boleto } from '../../boletos/entities/boleto.entity';
import { Escenario } from '../../escenarios/entities/escenario.entity';

@Entity('localidades')
@Unique('UQ_localidad_escenario_nombre', ['escenario', 'nombre'])
export class Localidad {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string | null;

  @Column({ type: 'int' })
  capacidad!: number;

  @Column({ name: 'precio_base', type: 'decimal', precision: 10, scale: 2, default: 0 })
  precioBase!: number;

  @Column({ type: 'boolean', default: true })
  activa!: boolean;

  // Pertenece a un único Escenario (N:1)
  @ManyToOne(() => Escenario, (escenario) => escenario.localidades, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'escenario_id' })
  escenario!: Escenario;

  // Una localidad tiene muchos boletos (1:N)
  @OneToMany(() => Boleto, (boleto) => boleto.localidad)
  boletos?: Boleto[];
}

