import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Habilidad } from '../../habilidades/entities/habilidad.entity';
import { Jugador } from '../../jugadores/entities/jugador.entity';

@Entity('habilidades_jugadores')
@Unique('UQ_habilidades_jugadores_jugador_habilidad', ['jugador', 'habilidad'])
export class HabilidadJugador {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', default: 1 })
  nivel!: number;

  @Column({ name: 'fecha_registro', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fechaRegistro!: Date;

  @ManyToOne(() => Jugador, (jugador) => jugador.habilidades, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'jugador_id' })
  jugador!: Jugador;

  @ManyToOne(() => Habilidad, (habilidad) => habilidad.jugadores, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'habilidad_id' })
  habilidad!: Habilidad;
}
