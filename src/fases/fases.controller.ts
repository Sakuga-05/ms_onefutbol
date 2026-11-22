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
import { CreateFaseDto } from './dto/create-fase.dto';
import { UpdateFaseDto } from './dto/update-fase.dto';
import { FasesService } from './fases.service';

@Controller('fases')
export class FasesController {
  constructor(private readonly fasesService: FasesService) {}

  @Post()
  create(@Body() dto: CreateFaseDto) {
    return this.fasesService.create(dto);
  }

  @Get()
  findAll() {
    return this.fasesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.fasesService.findOne(id);
  }

  @Get(':id/partidos')
  findPartidos(@Param('id', ParseIntPipe) id: number) {
    return this.fasesService.findPartidos(id);
  }

  @Get(':id/grupos')
  findGrupos(@Param('id', ParseIntPipe) id: number) {
    return this.fasesService.findGrupos(id);
  }

  @Get(':id/final')
  findFinal(@Param('id', ParseIntPipe) id: number) {
    return this.fasesService.findFinal(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFaseDto) {
    return this.fasesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.fasesService.remove(id);
  }
}
