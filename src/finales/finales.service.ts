import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Equipo } from '../equipos/entities/equipo.entity';
import { Fase } from '../fases/entities/fase.entity';
import { CreateFinalDto } from './dto/create-final.dto';
import { FinalResponseDto } from './dto/final-response.dto';
import { UpdateFinalDto } from './dto/update-final.dto';
import { Final } from './entities/final.entity';
import { FinalMapper } from './mappers/final.mapper';
import { FinalesRepository } from './repositories/finales.repository';

@Injectable()
export class FinalesService {
  constructor(
    @InjectRepository(Final)
    private readonly finalesRepository: Repository<Final>,
    @InjectRepository(Fase)
    private readonly fasesRepository: Repository<Fase>,
    @InjectRepository(Equipo)
    private readonly equiposRepository: Repository<Equipo>,
    private readonly customFinalesRepository: FinalesRepository,
  ) {}

  async create(dto: CreateFinalDto): Promise<FinalResponseDto> {
    const fase = await this.findFase(dto.faseId);
    await this.validateUniqueFase(fase.id);
    const equipos = await this.findEquipos(dto.equipoIds);
    this.validateEquiposActivos(equipos);

    const saved = await this.finalesRepository.save(FinalMapper.toEntity(dto, fase, equipos));
    return FinalMapper.toResponseDto(saved);
  }

  async findAll(): Promise<FinalResponseDto[]> {
    const list = await this.finalesRepository.find({
      relations: { fase: true, equipos: true },
      order: { id: 'ASC' },
    });
    return FinalMapper.toResponseDtoList(list);
  }

  async findOne(id: number): Promise<FinalResponseDto> {
    return FinalMapper.toResponseDto(await this.findFinal(id));
  }

  async update(id: number, dto: UpdateFinalDto): Promise<FinalResponseDto> {
    const finalItem = await this.findFinal(id);
    const equipos = dto.equipoIds === undefined ? undefined : await this.findEquipos(dto.equipoIds);
    let fase: Fase | undefined;
    if (dto.faseId !== undefined) {
      fase = await this.findFase(dto.faseId);
      await this.validateUniqueFase(fase.id, id);
    }
    if (dto.equipoIds !== undefined || fase !== undefined) {
      this.validateEquiposActivos(equipos ?? finalItem.equipos);
    }
    const saved = await this.finalesRepository.save(
      FinalMapper.mergeEntity(finalItem, dto, fase, equipos),
    );
    return FinalMapper.toResponseDto(saved);
  }

  async remove(id: number): Promise<{ message: string }> {
    const finalItem = await this.findFinal(id);
    if (await this.customFinalesRepository.hasDependencies(id)) {
      throw new ConflictException(
        'No se puede eliminar una final que tenga partidos o equipos asociados',
      );
    }
    await this.finalesRepository.remove(finalItem);
    return { message: `Final #${id} eliminada correctamente` };
  }

  private async findFinal(id: number): Promise<Final> {
    const item = await this.finalesRepository.findOne({
      where: { id },
      relations: { fase: true, equipos: true },
    });
    if (!item) throw new NotFoundException(`No se encontró la final con id ${id}`);
    return item;
  }

  private async findFase(id: number): Promise<Fase> {
    const fase = await this.fasesRepository.findOneBy({ id });
    if (!fase) throw new NotFoundException(`No se encontró la fase con id ${id}`);
    return fase;
  }

  private async validateUniqueFase(faseId: number, excludeId?: number): Promise<void> {
    if (await this.customFinalesRepository.existsByFase(faseId, excludeId)) {
      throw new ConflictException('Ya existe una configuración de final para esta fase');
    }
  }

  private async findEquipos(ids: number[] = []): Promise<Equipo[]> {
    const equipos = ids.length ? await this.equiposRepository.findBy({ id: In(ids) }) : [];
    if (equipos.length !== ids.length) {
      throw new NotFoundException('Uno o más equipos seleccionados no existen');
    }
    return equipos;
  }

  private validateEquiposActivos(equipos: Equipo[]): void {
    const equipoInactivo = equipos.find((equipo) => !equipo.activo);
    if (equipoInactivo) {
      throw new ConflictException(
        `El equipo ${equipoInactivo.nombre} está inactivo y no puede participar en una final`,
      );
    }
  }
}
