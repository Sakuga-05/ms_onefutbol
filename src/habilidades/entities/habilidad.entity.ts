import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HabilidadJugador } from '../../habilidades-jugadores/entities/habilidad-jugador.entity';

@Entity('habilidades')
export class Habilidad {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100, unique: true })
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string | null;

  @Column({ type: 'boolean', default: true })
  activa!: boolean;

  @OneToMany(
    () => HabilidadJugador,
    (habilidadJugador) => habilidadJugador.habilidad,
  )
  jugadores?: HabilidadJugador[];
}
