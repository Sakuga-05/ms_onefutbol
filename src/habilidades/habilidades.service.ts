import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHabilidadDto } from './dto/create-habilidad.dto';
import { HabilidadResponseDto } from './dto/habilidad-response.dto';
import { UpdateHabilidadDto } from './dto/update-habilidad.dto';
import { Habilidad } from './entities/habilidad.entity';
import { HabilidadMapper } from './mappers/habilidad.mapper';
import { HabilidadesRepository } from './repositories/habilidades.repository';

@Injectable()
export class HabilidadesService {
  constructor(@InjectRepository(Habilidad) private readonly repository: Repository<Habilidad>, private readonly customRepository: HabilidadesRepository) {}
  async create(dto: CreateHabilidadDto): Promise<HabilidadResponseDto> {
    await this.validateName(dto.nombre);
    return HabilidadMapper.toResponseDto(await this.repository.save(HabilidadMapper.toEntity(dto)));
  }
  async findAll(): Promise<HabilidadResponseDto[]> {
    return HabilidadMapper.toResponseDtoList(await this.repository.find({ order: { id: 'ASC' } }));
  }
  async findOne(id: number): Promise<HabilidadResponseDto> { return HabilidadMapper.toResponseDto(await this.findHabilidad(id)); }
  async findJugadores(id: number) {
    await this.findHabilidad(id);
    const jugadores = await this.customRepository.findJugadoresByHabilidad(id);
    return {
      habilidadId: id,
      totalJugadores: jugadores.length,
      jugadores,
      mensaje: jugadores.length === 0 ? 'No hay jugadores con esta habilidad' : undefined,
    };
  }
  async update(id: number, dto: UpdateHabilidadDto): Promise<HabilidadResponseDto> {
    const habilidad = await this.findHabilidad(id);
    if (dto.nombre !== undefined) await this.validateName(dto.nombre, id);
    return HabilidadMapper.toResponseDto(await this.repository.save(HabilidadMapper.mergeEntity(habilidad, dto)));
  }
  async remove(id: number): Promise<{ message: string }> {
    const habilidad = await this.findHabilidad(id);
    if (await this.customRepository.hasJugadores(id)) throw new ConflictException('No se puede eliminar una habilidad asociada a jugadores');
    await this.repository.remove(habilidad);
    return { message: `Habilidad #${id} eliminada correctamente` };
  }
  private async findHabilidad(id: number): Promise<Habilidad> {
    const item = await this.repository.findOneBy({ id });
    if (!item) throw new NotFoundException(`No se encontro la habilidad con id ${id}`);
    return item;
  }
  private async validateName(nombre: string, excludeId?: number): Promise<void> {
    if (await this.customRepository.existsByName(nombre.trim(), excludeId)) throw new ConflictException('Ya existe una habilidad con ese nombre');
  }
}
