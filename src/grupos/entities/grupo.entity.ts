import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Equipo } from '../../equipos/entities/equipo.entity';
import { Fase } from '../../fases/entities/fase.entity';

@Entity('grupos')
export class Grupo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string | null;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  // Pertenece a una Fase (N:1)
  @ManyToOne(() => Fase, (fase) => fase.grupos, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'fase_id' })
  fase!: Fase;

  // Un Grupo tiene muchos Equipos (1:N)
  @OneToMany(() => Equipo, (equipo) => equipo.grupo)
  equipos?: Equipo[];
}
