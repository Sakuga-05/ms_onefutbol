import { EquipoDeporte } from '../../equipos-deportes/entities/equipo-deporte.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('equipos')
export class Equipo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 120 })
  nombre!: string;

  @Column({ length: 12 })
  siglas!: string;

  @Column({ name: 'fecha_fundacion', type: 'date' })
  fechaFundacion!: string;

  @Column({ length: 120 })
  ciudad!: string;

  @Column({ length: 120 })
  pais!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  escudo!: string | null;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  @OneToMany(() => EquipoDeporte, (equipoDeporte) => equipoDeporte.equipo)
  deportes?: EquipoDeporte[];
}
