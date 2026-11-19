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
import { CreateLocalidadDto } from './dto/create-localidad.dto';
import { UpdateLocalidadDto } from './dto/update-localidad.dto';
import { LocalidadesService } from './localidades.service';

@Controller('localidades')
export class LocalidadesController {
  constructor(private readonly localidadesService: LocalidadesService) {}

  @Post()
  create(@Body() dto: CreateLocalidadDto) {
    return this.localidadesService.create(dto);
  }

  @Get()
  findAll() {
    return this.localidadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.localidadesService.findOne(id);
  }

  @Get(':id/boletos')
  findBoletos(@Param('id', ParseIntPipe) id: number) {
    return this.localidadesService.findBoletos(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLocalidadDto,
  ) {
    return this.localidadesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.localidadesService.remove(id);
  }
}

