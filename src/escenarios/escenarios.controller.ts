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
import { CreateEscenarioDto } from './dto/create-escenario.dto';
import { UpdateEscenarioDto } from './dto/update-escenario.dto';
import { EscenariosService } from './escenarios.service';

@Controller('escenarios')
export class EscenariosController {
  constructor(private readonly escenariosService: EscenariosService) {}

  @Post()
  create(@Body() dto: CreateEscenarioDto) {
    return this.escenariosService.create(dto);
  }

  @Get()
  findAll() {
    return this.escenariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.escenariosService.findOne(id);
  }

  @Get(':id/subescenarios')
  findSubescenarios(@Param('id', ParseIntPipe) id: number) {
    return this.escenariosService.findSubescenarios(id);
  }

  @Get(':id/localidades')
  findLocalidades(@Param('id', ParseIntPipe) id: number) {
    return this.escenariosService.findLocalidades(id);
  }

  @Get(':id/partidos')
  findPartidos(@Param('id', ParseIntPipe) id: number) {
    return this.escenariosService.findPartidos(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEscenarioDto,
  ) {
    return this.escenariosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.escenariosService.remove(id);
  }
}

