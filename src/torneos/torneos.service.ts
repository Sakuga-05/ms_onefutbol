import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deporte } from '../deportes/entities/deporte.entity';
import { CreateTorneoDto } from './dto/create-torneo.dto';
import { TorneoResponseDto } from './dto/torneo-response.dto';
import { UpdateTorneoDto } from './dto/update-torneo.dto';
import { Torneo } from './entities/torneo.entity';
import { TorneoMapper } from './mappers/torneo.mapper';
import { TorneosRepository } from './repositories/torneos.repository';

@Injectable()
export class TorneosService {
  constructor(
    @InjectRepository(Torneo)
    private readonly torneosRepository: Repository<Torneo>,
    @InjectRepository(Deporte)
    private readonly deportesRepository: Repository<Deporte>,
    private readonly customTorneosRepository: TorneosRepository,
  ) {}

  async create(dto: CreateTorneoDto): Promise<TorneoResponseDto> {
    await this.validateUniqueName(dto.nombre);
    const deporte = await this.findDeporte(dto.deporteId);
    const saved = await this.torneosRepository.save(TorneoMapper.toEntity(dto, deporte));
    return TorneoMapper.toResponseDto(saved);
  }

  async findAll(): Promise<TorneoResponseDto[]> {
    const torneos = await this.torneosRepository.find({
      relations: { deporte: true },
      order: { id: 'ASC' },
    });
    return TorneoMapper.toResponseDtoList(torneos);
  }

  async findOne(id: number): Promise<TorneoResponseDto> {
    return TorneoMapper.toResponseDto(await this.findTorneo(id));
  }

  async findFases(id: number) {
    const torneo = await this.customTorneosRepository.findWithFases(id);
    if (!torneo) throw new NotFoundException(`No se encontró el torneo con id ${id}`);
    return torneo.fases ?? [];
  }

  async findInscripciones(id: number) {
    const torneo = await this.customTorneosRepository.findWithInscripciones(id);
    if (!torneo) throw new NotFoundException(`No se encontró el torneo con id ${id}`);
    return torneo.inscripciones ?? [];
  }

  async findEscenarios(id: number) {
    const torneo = await this.customTorneosRepository.findWithEscenarios(id);
    if (!torneo) throw new NotFoundException(`No se encontró el torneo con id ${id}`);
    return torneo.escenariosTorneos ?? [];
  }

  async update(id: number, dto: UpdateTorneoDto): Promise<TorneoResponseDto> {
    const torneo = await this.findTorneo(id);
    if (dto.nombre !== undefined) {
      await this.validateUniqueName(dto.nombre, id);
    }
    let deporte: Deporte | undefined;
    if (dto.deporteId !== undefined) {
      deporte = await this.findDeporte(dto.deporteId);
    }
    const saved = await this.torneosRepository.save(
      TorneoMapper.mergeEntity(torneo, dto, deporte),
    );
    return TorneoMapper.toResponseDto(saved);
  }

  async remove(id: number): Promise<{ message: string }> {
    const torneo = await this.findTorneo(id);
    if (await this.customTorneosRepository.hasDependencies(id)) {
      throw new ConflictException(
        'No se puede eliminar un torneo que tenga fases, partidos, inscripciones o escenarios asociados',
      );
    }
    await this.torneosRepository.remove(torneo);
    return { message: `Torneo #${id} eliminado correctamente` };
  }

  private async findTorneo(id: number): Promise<Torneo> {
    const torneo = await this.torneosRepository.findOne({
      where: { id },
      relations: { deporte: true },
    });
    if (!torneo) throw new NotFoundException(`No se encontró el torneo con id ${id}`);
    return torneo;
  }

  private async findDeporte(id: number): Promise<Deporte> {
    const deporte = await this.deportesRepository.findOneBy({ id });
    if (!deporte) throw new NotFoundException(`No se encontró el deporte con id ${id}`);
    return deporte;
  }

  private async validateUniqueName(nombre: string, excludeId?: number): Promise<void> {
    if (await this.customTorneosRepository.existsByName(nombre, excludeId)) {
      throw new ConflictException(`Ya existe un torneo con el nombre "${nombre}"`);
    }
  }
}
