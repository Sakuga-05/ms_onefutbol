import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Anotacion } from '../../anotaciones/entities/anotacion.entity';
import { Contrato } from '../../contratos/entities/contrato.entity';
import { HabilidadJugador } from '../../habilidades-jugadores/entities/habilidad-jugador.entity';
import { PosicionEspacial } from '../../posiciones-espaciales/entities/posicion-espacial.entity';

@Entity('jugadores')
export class Jugador {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nombres!: string;

  @Column({ length: 100 })
  apellidos!: string;

  @Column({ type: 'varchar', length: 30, unique: true, nullable: true })
  identificacion?: string | null;

  @Column({ name: 'numero_camiseta', type: 'int' })
  numeroCamiseta!: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nacionalidad?: string | null;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  @OneToMany(() => Anotacion, (anotacion) => anotacion.jugador)
  anotaciones?: Anotacion[];

  @OneToMany(
    () => HabilidadJugador,
    (habilidadJugador) => habilidadJugador.jugador,
  )
  habilidades?: HabilidadJugador[];

  @OneToMany(
    () => PosicionEspacial,
    (posicion) => posicion.jugador,
  )
  posicionesEspaciales?: PosicionEspacial[];

  @OneToMany(() => Contrato, (contrato) => contrato.jugador)
  contratos?: Contrato[];
}
