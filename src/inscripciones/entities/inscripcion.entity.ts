import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Equipo } from '../../equipos/entities/equipo.entity';
import { Torneo } from '../../torneos/entities/torneo.entity';

@Entity('inscripciones')
@Unique('UQ_inscripciones_torneo_equipo', ['torneo', 'equipo'])
export class Inscripcion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'fecha_inscripcion', type: 'date' })
  fechaInscripcion!: string;

  @Column({ name: 'numero_registro', length: 50, unique: true })
  numeroRegistro!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  costo!: number;

  @Column({ length: 30, default: 'CONFIRMADA' })
  estado!: string;

  // Pertenece a un Torneo (N:1)
  @ManyToOne(() => Torneo, (torneo) => torneo.inscripciones, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'torneo_id' })
  torneo!: Torneo;

  // Pertenece a un Equipo (N:1)
  @ManyToOne(() => Equipo, (equipo) => equipo.inscripciones, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'equipo_id' })
  equipo!: Equipo;
}
