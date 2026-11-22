import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Fase } from '../../fases/entities/fase.entity';

@Entity('finales')
export class Final {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'premio_campeon', type: 'decimal', precision: 12, scale: 2, default: 0 })
  premioCampeon!: number;

  @Column({ name: 'premio_subcampeon', type: 'decimal', precision: 12, scale: 2, default: 0 })
  premioSubcampeon!: number;

  @Column({ name: 'tiempo_extra', type: 'boolean', default: true })
  tiempoExtra!: boolean;

  @Column({ name: 'definicion_penales', type: 'boolean', default: true })
  definicionPenales!: boolean;

  @Column({ name: 'trofeo_nombre', length: 100 })
  trofeoNombre!: string;

  @Column({ name: 'reglas_especificas', type: 'text', nullable: true })
  reglasEspecificas!: string | null;

  // Se asocia directamente a una Fase (1:1)
  @OneToOne(() => Fase, (fase) => fase.final, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'fase_id' })
  fase!: Fase;
}
