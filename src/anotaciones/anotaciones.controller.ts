import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateAnotacionDto } from './dto/create-anotacion.dto';
import { UpdateAnotacionDto } from './dto/update-anotacion.dto';
import { AnotacionesService } from './anotaciones.service';
@Controller('anotaciones')
export class AnotacionesController {
  constructor(private readonly service: AnotacionesService) {}
  @Post() create(@Body() dto: CreateAnotacionDto) { return this.service.create(dto); }
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAnotacionDto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
