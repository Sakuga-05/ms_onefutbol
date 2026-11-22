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
import { CreateFinalDto } from './dto/create-final.dto';
import { UpdateFinalDto } from './dto/update-final.dto';
import { FinalesService } from './finales.service';

@Controller('finales')
export class FinalesController {
  constructor(private readonly finalesService: FinalesService) {}

  @Post()
  create(@Body() dto: CreateFinalDto) {
    return this.finalesService.create(dto);
  }

  @Get()
  findAll() {
    return this.finalesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.finalesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFinalDto) {
    return this.finalesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.finalesService.remove(id);
  }
}
