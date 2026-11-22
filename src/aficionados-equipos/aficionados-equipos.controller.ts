import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateAficionadoEquipoDto } from './dto/create-aficionado-equipo.dto';
import { UpdateAficionadoEquipoDto } from './dto/update-aficionado-equipo.dto';
import { AficionadosEquiposService } from './aficionados-equipos.service';
@Controller('aficionados-equipos')
export class AficionadosEquiposController {
  constructor(private readonly service: AficionadosEquiposService) {}
  @Post() create(@Body() dto: CreateAficionadoEquipoDto) { return this.service.create(dto); }
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAficionadoEquipoDto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
