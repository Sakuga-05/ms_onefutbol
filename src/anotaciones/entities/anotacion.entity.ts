import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Jugador } from '../../jugadores/entities/jugador.entity';
import { Partido } from '../../partidos/entities/partido.entity';

@Entity('anotaciones')
export class Anotacion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'minuto', type: 'int' })
  minuto!: number;

  @Column({ type: 'varchar', length: 30, default: 'GOL' })
  tipo!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string | null;

  @ManyToOne(() => Partido, (partido) => partido.anotaciones, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'partido_id' })
  partido!: Partido;

  @ManyToOne(() => Jugador, (jugador) => jugador.anotaciones, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'jugador_id' })
  jugador!: Jugador;
}
