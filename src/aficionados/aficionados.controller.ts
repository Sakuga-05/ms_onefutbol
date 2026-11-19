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
import { CreateAficionadoDto } from './dto/create-aficionado.dto';
import { UpdateAficionadoDto } from './dto/update-aficionado.dto';
import { AficionadosService } from './aficionados.service';

@Controller('aficionados')
export class AficionadosController {
  constructor(private readonly aficionadosService: AficionadosService) {}

  @Post()
  create(@Body() dto: CreateAficionadoDto) {
    return this.aficionadosService.create(dto);
  }

  @Get()
  findAll() {
    return this.aficionadosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.aficionadosService.findOne(id);
  }

  @Get(':id/boletos')
  findBoletos(@Param('id', ParseIntPipe) id: number) {
    return this.aficionadosService.findBoletos(id);
  }

  @Get(':id/metodos-pago')
  findMetodosPago(@Param('id', ParseIntPipe) id: number) {
    return this.aficionadosService.findMetodosPago(id);
  }

  @Get(':id/apuestas')
  findApuestas(@Param('id', ParseIntPipe) id: number) {
    return this.aficionadosService.findApuestas(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAficionadoDto,
  ) {
    return this.aficionadosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.aficionadosService.remove(id);
  }
}

