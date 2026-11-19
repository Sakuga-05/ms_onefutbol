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
import { CreatePartidoDto } from './dto/create-partido.dto';
import { UpdatePartidoDto } from './dto/update-partido.dto';
import { PartidosService } from './partidos.service';

@Controller('partidos')
export class PartidosController {
  constructor(private readonly partidosService: PartidosService) {}

  @Post()
  create(@Body() dto: CreatePartidoDto) {
    return this.partidosService.create(dto);
  }

  @Get()
  findAll() {
    return this.partidosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.partidosService.findOne(id);
  }

  @Get(':id/boletos')
  findBoletos(@Param('id', ParseIntPipe) id: number) {
    return this.partidosService.findBoletos(id);
  }

  @Get(':id/apuestas')
  findApuestas(@Param('id', ParseIntPipe) id: number) {
    return this.partidosService.findApuestas(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePartidoDto,
  ) {
    return this.partidosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.partidosService.remove(id);
  }
}

