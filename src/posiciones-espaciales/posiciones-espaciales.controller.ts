import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreatePosicionEspacialDto } from './dto/create-posicion-espacial.dto';
import { UpdatePosicionEspacialDto } from './dto/update-posicion-espacial.dto';
import { PosicionesEspacialesService } from './posiciones-espaciales.service';
@Controller('posiciones-espaciales')
export class PosicionesEspacialesController {
  constructor(private readonly service: PosicionesEspacialesService) {}
  @Post() create(@Body() dto: CreatePosicionEspacialDto) { return this.service.create(dto); }
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePosicionEspacialDto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
