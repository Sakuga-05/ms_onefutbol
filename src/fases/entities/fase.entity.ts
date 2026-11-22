import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Final } from '../../finales/entities/final.entity';
import { Grupo } from '../../grupos/entities/grupo.entity';
import { Partido } from '../../partidos/entities/partido.entity';
import { Torneo } from '../../torneos/entities/torneo.entity';

@Entity('fases')
export class Fase {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ type: 'int', default: 1 })
  orden!: number;

  @Column({ length: 50, default: 'GRUPOS' })
  tipo!: string;

  @Column({ type: 'boolean', default: true })
  activa!: boolean;

  // Pertenece a un Torneo (N:1)
  @ManyToOne(() => Torneo, (torneo) => torneo.fases, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'torneo_id' })
  torneo!: Torneo;

  // Una Fase tiene muchos Partidos (1:N)
  @OneToMany(() => Partido, (partido) => partido.fase)
  partidos?: Partido[];

  // Una Fase puede tener muchos Grupos (1:N)
  @OneToMany(() => Grupo, (grupo) => grupo.fase)
  grupos?: Grupo[];

  // Una Fase puede ser o tener una Final (1:1)
  @OneToOne(() => Final, (final) => final.fase)
  final?: Final;
}
