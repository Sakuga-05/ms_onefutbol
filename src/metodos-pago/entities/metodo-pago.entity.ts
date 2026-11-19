import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MetodoPagoAficionado } from '../../metodos-pago-aficionados/entities/metodo-pago-aficionado.entity';

@Entity('metodos_pago')
export class MetodoPago {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 80, unique: true })
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string | null;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  // Un método de pago puede estar registrado por muchos aficionados (1:N)
  @OneToMany(
    () => MetodoPagoAficionado,
    (metodoAficionado) => metodoAficionado.metodoPago,
  )
  metodosAficionados?: MetodoPagoAficionado[];
}

