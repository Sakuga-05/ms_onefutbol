import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Aficionado } from '../../aficionados/entities/aficionado.entity';
import { Equipo } from '../../equipos/entities/equipo.entity';

@Entity('aficionados_equipos')
@Unique('UQ_aficionados_equipos_aficionado_equipo', ['aficionado', 'equipo'])
export class AficionadoEquipo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'fecha_asociacion', type: 'date' })
  fechaAsociacion!: string;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  @ManyToOne(() => Aficionado, (aficionado) => aficionado.equipos, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'aficionado_id' })
  aficionado!: Aficionado;

  @ManyToOne(() => Equipo, (equipo) => equipo.aficionados, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'equipo_id' })
  equipo!: Equipo;
}
