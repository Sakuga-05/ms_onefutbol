import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateHabilidadDto } from './dto/create-habilidad.dto';
import { UpdateHabilidadDto } from './dto/update-habilidad.dto';
import { HabilidadesService } from './habilidades.service';
@Controller('habilidades')
export class HabilidadesController {
  constructor(private readonly service: HabilidadesService) {}
  @Post() create(@Body() dto: CreateHabilidadDto) { return this.service.create(dto); }
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id/jugadores') findJugadores(@Param('id', ParseIntPipe) id: number) { return this.service.findJugadores(id); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHabilidadDto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
