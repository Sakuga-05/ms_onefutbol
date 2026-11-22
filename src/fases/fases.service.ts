import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Torneo } from '../torneos/entities/torneo.entity';
import { CreateFaseDto } from './dto/create-fase.dto';
import { FaseResponseDto } from './dto/fase-response.dto';
import { UpdateFaseDto } from './dto/update-fase.dto';
import { Fase } from './entities/fase.entity';
import { FaseMapper } from './mappers/fase.mapper';
import { FasesRepository } from './repositories/fases.repository';

@Injectable()
export class FasesService {
  constructor(
    @InjectRepository(Fase)
    private readonly fasesRepository: Repository<Fase>,
    @InjectRepository(Torneo)
    private readonly torneosRepository: Repository<Torneo>,
    private readonly customFasesRepository: FasesRepository,
  ) {}

  async create(dto: CreateFaseDto): Promise<FaseResponseDto> {
    const torneo = await this.findTorneo(dto.torneoId);
    const saved = await this.fasesRepository.save(FaseMapper.toEntity(dto, torneo));
    return FaseMapper.toResponseDto(saved);
  }

  async findAll(): Promise<FaseResponseDto[]> {
    const fases = await this.fasesRepository.find({
      relations: { torneo: true },
      order: { orden: 'ASC', id: 'ASC' },
    });
    return FaseMapper.toResponseDtoList(fases);
  }

  async findOne(id: number): Promise<FaseResponseDto> {
    return FaseMapper.toResponseDto(await this.findFase(id));
  }

  async findPartidos(id: number) {
    const fase = await this.customFasesRepository.findWithPartidos(id);
    if (!fase) throw new NotFoundException(`No se encontró la fase con id ${id}`);
    return fase.partidos ?? [];
  }

  async findGrupos(id: number) {
    const fase = await this.customFasesRepository.findWithGrupos(id);
    if (!fase) throw new NotFoundException(`No se encontró la fase con id ${id}`);
    return fase.grupos ?? [];
  }

  async findFinal(id: number) {
    const fase = await this.customFasesRepository.findWithFinal(id);
    if (!fase) throw new NotFoundException(`No se encontró la fase con id ${id}`);
    return fase.final ?? null;
  }

  async update(id: number, dto: UpdateFaseDto): Promise<FaseResponseDto> {
    const fase = await this.findFase(id);
    let torneo: Torneo | undefined;
    if (dto.torneoId !== undefined) {
      torneo = await this.findTorneo(dto.torneoId);
    }
    const saved = await this.fasesRepository.save(
      FaseMapper.mergeEntity(fase, dto, torneo),
    );
    return FaseMapper.toResponseDto(saved);
  }

  async remove(id: number): Promise<{ message: string }> {
    const fase = await this.findFase(id);
    if (await this.customFasesRepository.hasDependencies(id)) {
      throw new ConflictException(
        'No se puede eliminar una fase que tenga partidos, grupos o final asociados',
      );
    }
    await this.fasesRepository.remove(fase);
    return { message: `Fase #${id} eliminada correctamente` };
  }

  private async findFase(id: number): Promise<Fase> {
    const fase = await this.fasesRepository.findOne({
      where: { id },
      relations: { torneo: true },
    });
    if (!fase) throw new NotFoundException(`No se encontró la fase con id ${id}`);
    return fase;
  }

  private async findTorneo(id: number): Promise<Torneo> {
    const torneo = await this.torneosRepository.findOneBy({ id });
    if (!torneo) throw new NotFoundException(`No se encontró el torneo con id ${id}`);
    return torneo;
  }
}
