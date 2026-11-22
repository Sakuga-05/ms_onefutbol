import { EquipoDeporte } from '../../equipos-deportes/entities/equipo-deporte.entity';
import { AficionadoEquipo } from '../../aficionados-equipos/entities/aficionado-equipo.entity';
import { Contrato } from '../../contratos/entities/contrato.entity';
import { Grupo } from '../../grupos/entities/grupo.entity';
import { Inscripcion } from '../../inscripciones/entities/inscripcion.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('equipos')
export class Equipo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 120 })
  nombre!: string;

  @Column({ length: 12 })
  siglas!: string;

  @Column({ name: 'fecha_fundacion', type: 'date' })
  fechaFundacion!: string;

  @Column({ length: 120 })
  ciudad!: string;

  @Column({ length: 120 })
  pais!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  escudo!: string | null;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  // Pertenece a un Grupo (N:1, grupo 1:N con equipo)
  @ManyToOne(() => Grupo, (grupo) => grupo.equipos, {
    nullable: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'grupo_id' })
  grupo?: Grupo | null;

  @OneToMany(() => EquipoDeporte, (equipoDeporte) => equipoDeporte.equipo)
  deportes?: EquipoDeporte[];

  @OneToMany(
    () => AficionadoEquipo,
    (aficionadoEquipo) => aficionadoEquipo.equipo,
  )
  aficionados?: AficionadoEquipo[];

  // Relación N:M con Torneo mediante Inscripción (1:N)
  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.equipo)
  inscripciones?: Inscripcion[];

  // Asignación de jugadores mediante Contratos (1:N)
  @OneToMany(() => Contrato, (contrato) => contrato.equipo)
  contratos?: Contrato[];
}
