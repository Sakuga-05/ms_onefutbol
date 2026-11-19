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
import { CreateApuestaDto } from './dto/create-apuesta.dto';
import { UpdateApuestaDto } from './dto/update-apuesta.dto';
import { ApuestasService } from './apuestas.service';

@Controller('apuestas')
export class ApuestasController {
  constructor(private readonly apuestasService: ApuestasService) {}

  @Post()
  create(@Body() dto: CreateApuestaDto) {
    return this.apuestasService.create(dto);
  }

  @Get()
  findAll() {
    return this.apuestasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.apuestasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateApuestaDto,
  ) {
    return this.apuestasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.apuestasService.remove(id);
  }
}

