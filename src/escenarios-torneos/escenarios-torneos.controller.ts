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
import { CreateEscenarioTorneoDto } from './dto/create-escenario-torneo.dto';
import { UpdateEscenarioTorneoDto } from './dto/update-escenario-torneo.dto';
import { EscenariosTorneosService } from './escenarios-torneos.service';

@Controller('escenarios-torneos')
export class EscenariosTorneosController {
  constructor(private readonly service: EscenariosTorneosService) {}

  @Post()
  create(@Body() dto: CreateEscenarioTorneoDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEscenarioTorneoDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
