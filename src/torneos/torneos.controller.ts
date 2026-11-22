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
import { CreateTorneoDto } from './dto/create-torneo.dto';
import { UpdateTorneoDto } from './dto/update-torneo.dto';
import { TorneosService } from './torneos.service';

@Controller('torneos')
export class TorneosController {
  constructor(private readonly torneosService: TorneosService) {}

  @Post()
  create(@Body() dto: CreateTorneoDto) {
    return this.torneosService.create(dto);
  }

  @Get()
  findAll() {
    return this.torneosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.torneosService.findOne(id);
  }

  @Get(':id/fases')
  findFases(@Param('id', ParseIntPipe) id: number) {
    return this.torneosService.findFases(id);
  }

  @Get(':id/inscripciones')
  findInscripciones(@Param('id', ParseIntPipe) id: number) {
    return this.torneosService.findInscripciones(id);
  }

  @Get(':id/escenarios')
  findEscenarios(@Param('id', ParseIntPipe) id: number) {
    return this.torneosService.findEscenarios(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTorneoDto) {
    return this.torneosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.torneosService.remove(id);
  }
}
