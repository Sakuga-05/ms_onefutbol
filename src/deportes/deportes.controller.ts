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
import { CreateDeporteDto } from './dto/create-deporte.dto';
import { UpdateDeporteDto } from './dto/update-deporte.dto';
import { DeportesService } from './deportes.service';

@Controller('deportes')
export class DeportesController {
  constructor(private readonly deportesService: DeportesService) {}

  @Post()
  create(@Body() dto: CreateDeporteDto) {
    return this.deportesService.create(dto);
  }

  @Get()
  findAll() {
    return this.deportesService.findAll();
  }

  @Get(':id/equipos')
  findEquipos(@Param('id', ParseIntPipe) id: number) {
    return this.deportesService.findEquipos(id);
  }

  @Get(':id/subdeportes')
  findSubdeportes(@Param('id', ParseIntPipe) id: number) {
    return this.deportesService.findSubdeportes(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.deportesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDeporteDto) {
    return this.deportesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deportesService.remove(id);
  }
}
