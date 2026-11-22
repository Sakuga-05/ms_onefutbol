import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { EquiposService } from './equipos.service';
import type { UploadedShield } from './equipos.service';
import { escudoUploadOptions } from './upload/escudo-upload.config';

@Controller('equipos')
export class EquiposController {
  constructor(private readonly equiposService: EquiposService) {}

  @Post()
  @UseInterceptors(FileInterceptor('escudo', escudoUploadOptions))
  create(@Body() dto: CreateEquipoDto, @UploadedFile() file?: UploadedShield) {
    return this.equiposService.create(dto, file);
  }

  @Get()
  findAll() {
    return this.equiposService.findAll();
  }

  @Get(':id/deportes')
  findDeportes(@Param('id', ParseIntPipe) id: number) {
    return this.equiposService.findDeportes(id);
  }

  @Get(':id/jugadores')
  findJugadores(@Param('id', ParseIntPipe) id: number) {
    return this.equiposService.findJugadores(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.equiposService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('escudo', escudoUploadOptions))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEquipoDto,
    @UploadedFile() file?: UploadedShield,
  ) {
    return this.equiposService.update(id, dto, file);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.equiposService.remove(id);
  }
}
