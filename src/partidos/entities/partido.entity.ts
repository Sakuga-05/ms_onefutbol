import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Boleto } from '../../boletos/entities/boleto.entity';
import { Escenario } from '../../escenarios/entities/escenario.entity';
import { Apuesta } from '../../apuestas/entities/apuesta.entity';

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

  // Pertenece a un único Escenario (N:1)
  @ManyToOne(() => Escenario, (escenario) => escenario.partidos, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'escenario_id' })
  escenario!: Escenario;

  // Un Partido puede tener muchos Boletos (1:N)
  @OneToMany(() => Boleto, (boleto) => boleto.partido)
  boletos?: Boleto[];

  // Un Partido puede recibir muchas Apuestas (1:N)
  @OneToMany(() => Apuesta, (apuesta) => apuesta.partido)
  apuestas?: Apuesta[];
}

