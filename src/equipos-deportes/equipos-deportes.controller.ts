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
import { CreateEquipoDeporteDto } from './dto/create-equipo-deporte.dto';
import { UpdateEquipoDeporteDto } from './dto/update-equipo-deporte.dto';
import { EquiposDeportesService } from './equipos-deportes.service';

@Controller('equipos-deportes')
export class EquiposDeportesController {
  constructor(
    private readonly equiposDeportesService: EquiposDeportesService,
  ) {}

  @Post()
  create(@Body() dto: CreateEquipoDeporteDto) {
    return this.equiposDeportesService.create(dto);
  }

  @Get()
  findAll() {
    return this.equiposDeportesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.equiposDeportesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEquipoDeporteDto) {
    return this.equiposDeportesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.equiposDeportesService.remove(id);
  }
}
