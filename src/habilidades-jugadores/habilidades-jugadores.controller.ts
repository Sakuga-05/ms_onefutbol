import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateHabilidadJugadorDto } from './dto/create-habilidad-jugador.dto';
import { UpdateHabilidadJugadorDto } from './dto/update-habilidad-jugador.dto';
import { HabilidadesJugadoresService } from './habilidades-jugadores.service';
@Controller('habilidades-jugadores')
export class HabilidadesJugadoresController {
  constructor(private readonly service: HabilidadesJugadoresService) {}
  @Post() create(@Body() dto: CreateHabilidadJugadorDto) { return this.service.create(dto); }
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHabilidadJugadorDto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
