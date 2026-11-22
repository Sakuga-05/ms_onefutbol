import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Deporte } from '../../deportes/entities/deporte.entity';
import { EscenarioTorneo } from '../../escenarios-torneos/entities/escenario-torneo.entity';
import { Fase } from '../../fases/entities/fase.entity';
import { Inscripcion } from '../../inscripciones/entities/inscripcion.entity';

@Entity('torneos')
export class Torneo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 120, unique: true })
  nombre!: string;

  @Column({ length: 50 })
  edicion!: string;

  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio!: string;

  @Column({ name: 'fecha_fin', type: 'date', nullable: true })
  fechaFin!: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  premio!: number;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  // Cada torneo pertenece a un deporte (N:1)
  @ManyToOne(() => Deporte, (deporte) => deporte.torneos, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'deporte_id' })
  deporte!: Deporte;

  // N:M con Equipo a través de Inscripción (1:N)
  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.torneo)
  inscripciones?: Inscripcion[];

  // N:M con Escenario a través de EscenarioTorneo (1:N)
  @OneToMany(() => EscenarioTorneo, (et) => et.torneo)
  escenariosTorneos?: EscenarioTorneo[];

  // 1:N con Fase
  @OneToMany(() => Fase, (fase) => fase.torneo)
  fases?: Fase[];
}
