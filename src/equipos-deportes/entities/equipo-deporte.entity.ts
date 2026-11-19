import { Deporte } from '../../deportes/entities/deporte.entity';
import { Equipo } from '../../equipos/entities/equipo.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('equipos_deportes')
@Unique('UQ_equipos_deportes_equipo_deporte', ['equipo', 'deporte'])
export class EquipoDeporte {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'fecha_inscripcion', type: 'date' })
  fechaInscripcion!: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  entrenador?: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  categoria?: string | null;

  @ManyToOne(() => Equipo, (equipo) => equipo.deportes, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'equipo_id' })
  equipo!: Equipo;

  @ManyToOne(() => Deporte, (deporte) => deporte.equiposDeportes, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'deporte_id' })
  deporte!: Deporte;
}
