import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Jugador } from '../../jugadores/entities/jugador.entity';
import { Pelota } from '../../pelotas/entities/pelota.entity';

@Entity('posiciones_espaciales')
export class PosicionEspacial {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  x!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  y!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  z!: string | null;

  @Column({ name: 'momento', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  momento!: Date;

  @ManyToOne(() => Jugador, (jugador) => jugador.posicionesEspaciales, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'jugador_id' })
  jugador!: Jugador;

  @ManyToOne(() => Pelota, (pelota) => pelota.posicionesEspaciales, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'pelota_id' })
  pelota!: Pelota;
}
