import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Equipo } from '../../equipos/entities/equipo.entity';
import { Jugador } from '../../jugadores/entities/jugador.entity';

@Entity('contratos')
export class Contrato {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio!: string;

  @Column({ name: 'fecha_fin', type: 'date', nullable: true })
  fechaFin!: string | null;

  @Column({ name: 'numero_camiseta', type: 'int', nullable: true })
  numeroCamiseta!: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  posicion!: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.0 })
  salario!: number;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  @ManyToOne(() => Jugador, (jugador) => jugador.contratos, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'jugador_id' })
  jugador!: Jugador;

  @ManyToOne(() => Equipo, (equipo) => equipo.contratos, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'equipo_id' })
  equipo!: Equipo;
}
