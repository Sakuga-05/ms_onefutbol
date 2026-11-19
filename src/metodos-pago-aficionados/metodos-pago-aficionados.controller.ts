import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateMetodoPagoAficionadoDto } from './dto/create-metodo-pago-aficionado.dto';
import { UpdateMetodoPagoAficionadoDto } from './dto/update-metodo-pago-aficionado.dto';
import { MetodosPagoAficionadosService } from './metodos-pago-aficionados.service';

@Controller('metodos-pago-aficionados')
export class MetodosPagoAficionadosController {
  constructor(
    private readonly metodosPagoAficionadosService: MetodosPagoAficionadosService,
  ) {}

  @Post()
  create(@Body() dto: CreateMetodoPagoAficionadoDto) {
    return this.metodosPagoAficionadosService.create(dto);
  }

  @Get()
  findAll() {
    return this.metodosPagoAficionadosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.metodosPagoAficionadosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMetodoPagoAficionadoDto,
  ) {
    return this.metodosPagoAficionadosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.metodosPagoAficionadosService.remove(id);
  }
}

