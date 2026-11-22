import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Partido } from '../../partidos/entities/partido.entity';
import { PosicionEspacial } from '../../posiciones-espaciales/entities/posicion-espacial.entity';

@Entity('pelotas')
export class Pelota {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo!: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  estado!: string | null;

  @OneToOne(() => Partido, (partido) => partido.pelota, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'partido_id' })
  partido!: Partido;

  @OneToMany(() => PosicionEspacial, (posicion) => posicion.pelota)
  posicionesEspaciales?: PosicionEspacial[];
}
