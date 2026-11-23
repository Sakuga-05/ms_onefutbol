import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Boleto } from '../../boletos/entities/boleto.entity';
import { Escenario } from '../../escenarios/entities/escenario.entity';
import { Apuesta } from '../../apuestas/entities/apuesta.entity';
import { Anotacion } from '../../anotaciones/entities/anotacion.entity';
import { Pelota } from '../../pelotas/entities/pelota.entity';
import { Fase } from '../../fases/entities/fase.entity';
import { Equipo } from '../../equipos/entities/equipo.entity';

@Entity('partidos')
export class Partido {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'fecha_hora', type: 'datetime' })
  fechaHora!: Date;

  @Column({ length: 30, default: 'PROGRAMADO' })
  estado!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string | null;

  // Pertenece a una Fase (N:1, partido n:1 con fase)
  @ManyToOne(() => Fase, (fase) => fase.partidos, {
    nullable: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'fase_id' })
  fase?: Fase | null;

  // Pertenece a un único Escenario (N:1)
  @ManyToOne(() => Escenario, (escenario) => escenario.partidos, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'escenario_id' })
  escenario!: Escenario;

  @ManyToOne(() => Equipo, { nullable: true, onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'equipo_local_id' })
  equipoLocal!: Equipo | null;

  @ManyToOne(() => Equipo, { nullable: true, onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'equipo_visitante_id' })
  equipoVisitante!: Equipo | null;

  @Column({ name: 'goles_local', type: 'int', nullable: true })
  golesLocal!: number | null;

  @Column({ name: 'goles_visitante', type: 'int', nullable: true })
  golesVisitante!: number | null;

  // Un Partido puede tener muchos Boletos (1:N)
  @OneToMany(() => Boleto, (boleto) => boleto.partido)
  boletos?: Boleto[];

  // Un Partido puede recibir muchas Apuestas (1:N)
  @OneToMany(() => Apuesta, (apuesta) => apuesta.partido)
  apuestas?: Apuesta[];

  @OneToMany(() => Anotacion, (anotacion) => anotacion.partido)
  anotaciones?: Anotacion[];

  @OneToOne(() => Pelota, (pelota) => pelota.partido)
  pelota?: Pelota;
}
