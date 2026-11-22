import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fase } from '../fases/entities/fase.entity';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { GrupoResponseDto } from './dto/grupo-response.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { Grupo } from './entities/grupo.entity';
import { GrupoMapper } from './mappers/grupo.mapper';
import { GruposRepository } from './repositories/grupos.repository';

@Injectable()
export class GruposService {
  constructor(
    @InjectRepository(Grupo)
    private readonly gruposRepository: Repository<Grupo>,
    @InjectRepository(Fase)
    private readonly fasesRepository: Repository<Fase>,
    private readonly customGruposRepository: GruposRepository,
  ) {}

  async create(dto: CreateGrupoDto): Promise<GrupoResponseDto> {
    const fase = await this.findFase(dto.faseId);
    const saved = await this.gruposRepository.save(GrupoMapper.toEntity(dto, fase));
    return GrupoMapper.toResponseDto(saved);
  }

  async findAll(): Promise<GrupoResponseDto[]> {
    const grupos = await this.gruposRepository.find({
      relations: { fase: true },
      order: { id: 'ASC' },
    });
    return GrupoMapper.toResponseDtoList(grupos);
  }

  async findOne(id: number): Promise<GrupoResponseDto> {
    return GrupoMapper.toResponseDto(await this.findGrupo(id));
  }

  async findEquipos(id: number) {
    const grupo = await this.customGruposRepository.findWithEquipos(id);
    if (!grupo) throw new NotFoundException(`No se encontró el grupo con id ${id}`);
    return grupo.equipos ?? [];
  }

  async update(id: number, dto: UpdateGrupoDto): Promise<GrupoResponseDto> {
    const grupo = await this.findGrupo(id);
    let fase: Fase | undefined;
    if (dto.faseId !== undefined) {
      fase = await this.findFase(dto.faseId);
    }
    const saved = await this.gruposRepository.save(
      GrupoMapper.mergeEntity(grupo, dto, fase),
    );
    return GrupoMapper.toResponseDto(saved);
  }

  async remove(id: number): Promise<{ message: string }> {
    const grupo = await this.findGrupo(id);
    if (await this.customGruposRepository.hasEquipos(id)) {
      throw new ConflictException(
        'No se puede eliminar un grupo que tenga equipos asignados',
      );
    }
    await this.gruposRepository.remove(grupo);
    return { message: `Grupo #${id} eliminado correctamente` };
  }

  private async findGrupo(id: number): Promise<Grupo> {
    const grupo = await this.gruposRepository.findOne({
      where: { id },
      relations: { fase: true },
    });
    if (!grupo) throw new NotFoundException(`No se encontró el grupo con id ${id}`);
    return grupo;
  }

  private async findFase(id: number): Promise<Fase> {
    const fase = await this.fasesRepository.findOneBy({ id });
    if (!fase) throw new NotFoundException(`No se encontró la fase con id ${id}`);
    return fase;
  }
}
