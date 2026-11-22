import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    private readonly customFinalesRepository: FinalesRepository,
  ) {}

  async create(dto: CreateFinalDto): Promise<FinalResponseDto> {
    const fase = await this.findFase(dto.faseId);
    await this.validateUniqueFase(fase.id);

    const saved = await this.finalesRepository.save(FinalMapper.toEntity(dto, fase));
    return FinalMapper.toResponseDto(saved);
  }

  async findAll(): Promise<FinalResponseDto[]> {
    const list = await this.finalesRepository.find({
      relations: { fase: true },
      order: { id: 'ASC' },
    });
    return FinalMapper.toResponseDtoList(list);
  }

  async findOne(id: number): Promise<FinalResponseDto> {
    return FinalMapper.toResponseDto(await this.findFinal(id));
  }

  async update(id: number, dto: UpdateFinalDto): Promise<FinalResponseDto> {
    const finalItem = await this.findFinal(id);
    let fase: Fase | undefined;
    if (dto.faseId !== undefined) {
      fase = await this.findFase(dto.faseId);
      await this.validateUniqueFase(fase.id, id);
    }
    const saved = await this.finalesRepository.save(
      FinalMapper.mergeEntity(finalItem, dto, fase),
    );
    return FinalMapper.toResponseDto(saved);
  }

  async remove(id: number): Promise<{ message: string }> {
    const finalItem = await this.findFinal(id);
    await this.finalesRepository.remove(finalItem);
    return { message: `Final #${id} eliminada correctamente` };
  }

  private async findFinal(id: number): Promise<Final> {
    const item = await this.finalesRepository.findOne({
      where: { id },
      relations: { fase: true },
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
}
