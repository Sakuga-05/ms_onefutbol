import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Aficionado } from '../../aficionados/entities/aficionado.entity';
import { Localidad } from '../../localidades/entities/localidad.entity';
import { Partido } from '../../partidos/entities/partido.entity';

@Entity('boletos')
export class Boleto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50, unique: true })
  codigo!: string;

  @Column({ name: 'fecha_compra', type: 'datetime' })
  fechaCompra!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio!: number;

  @Column({ length: 30, default: 'COMPRADO' })
  estado!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  asiento!: string | null;

  // Pertenece a un único Aficionado (N:1)
  @ManyToOne(() => Aficionado, (aficionado) => aficionado.boletos, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'aficionado_id' })
  aficionado!: Aficionado;

  // Pertenece a un único Partido (N:1)
  @ManyToOne(() => Partido, (partido) => partido.boletos, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'partido_id' })
  partido!: Partido;

  // Pertenece a una única Localidad (N:1)
  @ManyToOne(() => Localidad, (localidad) => localidad.boletos, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'localidad_id' })
  localidad!: Localidad;
}
