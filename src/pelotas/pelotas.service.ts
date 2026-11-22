import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partido } from '../partidos/entities/partido.entity';
import { CreatePelotaDto } from './dto/create-pelota.dto';
import { PelotaResponseDto } from './dto/pelota-response.dto';
import { UpdatePelotaDto } from './dto/update-pelota.dto';
import { Pelota } from './entities/pelota.entity';
import { PelotaMapper } from './mappers/pelota.mapper';
import { PelotasRepository } from './repositories/pelotas.repository';
@Injectable()
export class PelotasService {
  constructor(@InjectRepository(Pelota) private readonly repository: Repository<Pelota>, @InjectRepository(Partido) private readonly partidos: Repository<Partido>, private readonly custom: PelotasRepository) {}
  async create(dto: CreatePelotaDto): Promise<PelotaResponseDto> {
    const partido = await this.findPartido(dto.partidoId);
    await this.validateUniquePartido(dto.partidoId);
    return PelotaMapper.toResponseDto(await this.repository.save(PelotaMapper.toEntity(dto, partido)));
  }
  async findAll(): Promise<PelotaResponseDto[]> { return PelotaMapper.toResponseDtoList(await this.repository.find({ relations: { partido: true }, order: { id: 'ASC' } })); }
  async findOne(id: number): Promise<PelotaResponseDto> { return PelotaMapper.toResponseDto(await this.findPelota(id)); }
  async update(id: number, dto: UpdatePelotaDto): Promise<PelotaResponseDto> {
    const pelota = await this.findPelota(id);
    const partido = dto.partidoId !== undefined ? await this.findPartido(dto.partidoId) : undefined;
    if (dto.partidoId !== undefined) await this.validateUniquePartido(dto.partidoId, id);
    return PelotaMapper.toResponseDto(await this.repository.save(PelotaMapper.mergeEntity(pelota, dto, partido)));
  }
  async remove(id: number): Promise<{ message: string }> {
    const pelota = await this.findPelota(id);
    if (await this.custom.hasPosiciones(id)) throw new ConflictException('No se puede eliminar una pelota con posiciones espaciales asociadas');
    await this.repository.remove(pelota);
    return { message: `Pelota #${id} eliminada correctamente` };
  }
  private async findPelota(id: number): Promise<Pelota> { const item = await this.repository.findOne({ where: { id }, relations: { partido: true } }); if (!item) throw new NotFoundException(`No se encontro la pelota con id ${id}`); return item; }
  private async findPartido(id: number): Promise<Partido> { const item = await this.partidos.findOneBy({ id }); if (!item) throw new NotFoundException(`No se encontro el partido con id ${id}`); return item; }
  private async validateUniquePartido(partidoId: number, excludeId?: number) { if (await this.custom.existsByPartido(partidoId, excludeId)) throw new ConflictException('Ese partido ya tiene una pelota asociada'); }
}
