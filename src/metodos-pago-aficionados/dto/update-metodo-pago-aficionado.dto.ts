import { PartialType } from '@nestjs/mapped-types';
import { CreateMetodoPagoAficionadoDto } from './create-metodo-pago-aficionado.dto';

export class UpdateMetodoPagoAficionadoDto extends PartialType(
  CreateMetodoPagoAficionadoDto,
) {}

