import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Escenario } from '../../escenarios/entities/escenario.entity';
import { Torneo } from '../../torneos/entities/torneo.entity';

@Entity('escenarios_torneos')
@Unique('UQ_escenarios_torneos_escenario_torneo', ['escenario', 'torneo'])
export class EscenarioTorneo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'fecha_asignacion', type: 'date' })
  fechaAsignacion!: string;

  @Column({ name: 'es_principal', type: 'boolean', default: false })
  esPrincipal!: boolean;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  // Pertenece a un Escenario (N:1)
  @ManyToOne(() => Escenario, (escenario) => escenario.escenariosTorneos, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'escenario_id' })
  escenario!: Escenario;

  // Pertenece a un Torneo (N:1)
  @ManyToOne(() => Torneo, (torneo) => torneo.escenariosTorneos, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'torneo_id' })
  torneo!: Torneo;
}
