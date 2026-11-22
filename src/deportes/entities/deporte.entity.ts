import { EquipoDeporte } from '../../equipos-deportes/entities/equipo-deporte.entity';
import { Torneo } from '../../torneos/entities/torneo.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('deportes')
export class Deporte {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 120, unique: true })
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string | null;

  @Column({ name: 'es_colectivo', type: 'boolean' })
  esColectivo!: boolean;

  @Column({ name: 'min_jugadores', type: 'int' })
  minJugadores!: number;

  @Column({ name: 'max_jugadores', type: 'int' })
  maxJugadores!: number;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  // Deporte principal al que pertenece
  @ManyToOne(() => Deporte, (deporte) => deporte.subdeportes, {
    nullable: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'deporte_padre_id' })
  deportePadre!: Deporte | null;

  @OneToMany(() => Deporte, (deporte) => deporte.deportePadre)
  subdeportes?: Deporte[];

  @OneToMany(() => EquipoDeporte, (equipoDeporte) => equipoDeporte.deporte)
  equiposDeportes?: EquipoDeporte[];

  // Torneos organizados para este deporte (1:N)
  @OneToMany(() => Torneo, (torneo) => torneo.deporte)
  torneos?: Torneo[];
}
