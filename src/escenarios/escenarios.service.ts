import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEscenarioDto } from './dto/create-escenario.dto';
import { EscenarioResponseDto } from './dto/escenario-response.dto';
import { UpdateEscenarioDto } from './dto/update-escenario.dto';
import { Escenario } from './entities/escenario.entity';
import { EscenarioMapper } from './mappers/escenario.mapper';
import { EscenariosRepository } from './repositories/escenarios.repository';

@Injectable()
export class EscenariosService {
  constructor(
    @InjectRepository(Escenario)
    private readonly escenariosRepository: Repository<Escenario>,
    private readonly customEscenariosRepository: EscenariosRepository,
  ) {}

  async create(dto: CreateEscenarioDto): Promise<EscenarioResponseDto> {
    await this.validateUniqueName(dto.nombre);
    const escenarioPadre =
      dto.escenarioPadreId == null
        ? null
        : await this.findParent(dto.escenarioPadreId);

    const saved = await this.escenariosRepository.save(
      EscenarioMapper.toEntity(dto, escenarioPadre),
    );
    return EscenarioMapper.toResponseDto(saved);
  }

  async findAll(): Promise<EscenarioResponseDto[]> {
    const escenarios = await this.escenariosRepository.find({
      relations: { escenarioPadre: true, subescenarios: true },
      order: { id: 'ASC' },
    });
    return EscenarioMapper.toResponseDtoList(escenarios);
  }

  async findOne(id: number): Promise<EscenarioResponseDto> {
    return EscenarioMapper.toResponseDto(await this.findEscenario(id));
  }

  async findSubescenarios(id: number): Promise<EscenarioResponseDto[]> {
    await this.findEscenario(id);
    const subescenarios = await this.escenariosRepository.find({
      where: { escenarioPadre: { id } },
      relations: { escenarioPadre: true },
      order: { id: 'ASC' },
    });
    return EscenarioMapper.toResponseDtoList(subescenarios);
  }

  async findLocalidades(id: number) {
    const escenario = await this.customEscenariosRepository.findWithLocalidades(id);
    if (!escenario) throw new NotFoundException(`No se encontró el escenario con id ${id}`);
    return escenario.localidades ?? [];
  }

  async findPartidos(id: number) {
    const escenario = await this.customEscenariosRepository.findWithPartidos(id);
    if (!escenario) throw new NotFoundException(`No se encontró el escenario con id ${id}`);
    return escenario.partidos ?? [];
  }

  async update(id: number, dto: UpdateEscenarioDto): Promise<EscenarioResponseDto> {
    const escenario = await this.findEscenario(id);
    if (dto.nombre !== undefined) {
      await this.validateUniqueName(dto.nombre, id);
    }

    let padre: Escenario | null | undefined = undefined;
    if (dto.escenarioPadreId !== undefined) {
      padre =
        dto.escenarioPadreId === null
          ? null
          : await this.findParent(dto.escenarioPadreId, escenario);
    }

    const saved = await this.escenariosRepository.save(
      EscenarioMapper.mergeEntity(escenario, dto, padre),
    );
    return EscenarioMapper.toResponseDto(saved);
  }

  async remove(id: number): Promise<{ message: string }> {
    const escenario = await this.findEscenario(id);
    const { hasSubescenarios, hasLocalidades, hasPartidos } =
      await this.customEscenariosRepository.hasDependencies(id);

    if (hasSubescenarios || hasLocalidades || hasPartidos) {
      throw new ConflictException(
        'No se puede eliminar un escenario que tenga subescenarios, localidades o partidos asociados',
      );
    }

    await this.escenariosRepository.remove(escenario);
    return { message: `Escenario #${id} eliminado correctamente` };
  }

  // Validaciones
  private async findEscenario(id: number): Promise<Escenario> {
    const escenario = await this.escenariosRepository.findOne({
      where: { id },
      relations: { escenarioPadre: true, subescenarios: true },
    });
    if (!escenario) {
      throw new NotFoundException(`No se encontró el escenario con id ${id}`);
    }
    return escenario;
  }

  private async findParent(id: number, current?: Escenario): Promise<Escenario> {
    if (current?.id === id) {
      throw new BadRequestException('Un escenario no puede ser su propio padre');
    }
    const parent = await this.escenariosRepository.findOne({
      where: { id },
      relations: { escenarioPadre: true },
    });
    if (!parent) {
      throw new NotFoundException(`No se encontró el escenario padre con id ${id}`);
    }
    return parent;
  }

  private async validateUniqueName(nombre: string, excludeId?: number): Promise<void> {
    if (await this.customEscenariosRepository.existsByName(nombre, excludeId)) {
      throw new ConflictException(`Ya existe un escenario con el nombre "${nombre}"`);
    }
  }
}

