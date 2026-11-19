import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Localidad } from '../../localidades/entities/localidad.entity';
import { Partido } from '../../partidos/entities/partido.entity';

@Entity('escenarios')
export class Escenario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 120, unique: true })
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string | null;

  @Column({ length: 150 })
  ubicacion!: string;

  @Column({ type: 'int', default: 0 })
  capacidad!: number;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  // Relación reflexiva (1:N): un escenario puede pertenecer a un escenario padre
  @ManyToOne(() => Escenario, (escenario) => escenario.subescenarios, {
    nullable: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'escenario_padre_id' })
  escenarioPadre!: Escenario | null;

  // Un escenario puede contener varios subescenarios
  @OneToMany(() => Escenario, (escenario) => escenario.escenarioPadre)
  subescenarios?: Escenario[];

  // Un escenario tiene muchas localidades
  @OneToMany(() => Localidad, (localidad) => localidad.escenario)
  localidades?: Localidad[];

  // Un escenario alberga muchos partidos
  @OneToMany(() => Partido, (partido) => partido.escenario)
  partidos?: Partido[];
}

