import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Escenario } from '../escenarios/entities/escenario.entity';
import { CreateLocalidadDto } from './dto/create-localidad.dto';
import { LocalidadResponseDto } from './dto/localidad-response.dto';
import { UpdateLocalidadDto } from './dto/update-localidad.dto';
import { Localidad } from './entities/localidad.entity';
import { LocalidadMapper } from './mappers/localidad.mapper';
import { LocalidadesRepository } from './repositories/localidades.repository';

@Injectable()
export class LocalidadesService {
  constructor(
    @InjectRepository(Localidad)
    private readonly localidadesRepository: Repository<Localidad>,
    @InjectRepository(Escenario)
    private readonly escenariosRepository: Repository<Escenario>,
    private readonly customLocalidadesRepository: LocalidadesRepository,
  ) {}

  async create(dto: CreateLocalidadDto): Promise<LocalidadResponseDto> {
    const escenario = await this.findEscenario(dto.escenarioId);
    await this.validateUniqueName(dto.nombre, escenario.id);

    const saved = await this.localidadesRepository.save(
      LocalidadMapper.toEntity(dto, escenario),
    );
    return LocalidadMapper.toResponseDto(saved);
  }

  async findAll(): Promise<LocalidadResponseDto[]> {
    const localidades = await this.localidadesRepository.find({
      relations: { escenario: true },
      order: { id: 'ASC' },
    });
    return LocalidadMapper.toResponseDtoList(localidades);
  }

  async findOne(id: number): Promise<LocalidadResponseDto> {
    return LocalidadMapper.toResponseDto(await this.findLocalidad(id));
  }

  async findBoletos(id: number) {
    const localidad = await this.customLocalidadesRepository.findWithBoletos(id);
    if (!localidad) throw new NotFoundException(`No se encontró la localidad con id ${id}`);
    return localidad.boletos ?? [];
  }

  async update(id: number, dto: UpdateLocalidadDto): Promise<LocalidadResponseDto> {
    const localidad = await this.findLocalidad(id);
    let escenario: Escenario | undefined = undefined;

    if (dto.escenarioId !== undefined) {
      escenario = await this.findEscenario(dto.escenarioId);
    }

    const currentEscenarioId = escenario ? escenario.id : localidad.escenario.id;
    if (dto.nombre !== undefined || dto.escenarioId !== undefined) {
      const nombreToCheck = dto.nombre ?? localidad.nombre;
      await this.validateUniqueName(nombreToCheck, currentEscenarioId, id);
    }

    const saved = await this.localidadesRepository.save(
      LocalidadMapper.mergeEntity(localidad, dto, escenario),
    );
    return LocalidadMapper.toResponseDto(saved);
  }

  async remove(id: number): Promise<{ message: string }> {
    const localidad = await this.findLocalidad(id);
    if (await this.customLocalidadesRepository.hasBoletos(id)) {
      throw new ConflictException(
        'No se puede eliminar una localidad que tenga boletos asociados',
      );
    }

    await this.localidadesRepository.remove(localidad);
    return { message: `Localidad #${id} eliminada correctamente` };
  }

  // Validaciones
  private async findLocalidad(id: number): Promise<Localidad> {
    const localidad = await this.localidadesRepository.findOne({
      where: { id },
      relations: { escenario: true },
    });
    if (!localidad) {
      throw new NotFoundException(`No se encontró la localidad con id ${id}`);
    }
    return localidad;
  }

  private async findEscenario(id: number): Promise<Escenario> {
    const escenario = await this.escenariosRepository.findOneBy({ id });
    if (!escenario) {
      throw new NotFoundException(`No se encontró el escenario con id ${id}`);
    }
    return escenario;
  }

  private async validateUniqueName(
    nombre: string,
    escenarioId: number,
    excludeId?: number,
  ): Promise<void> {
    if (
      await this.customLocalidadesRepository.existsByNameInEscenario(
        nombre,
        escenarioId,
        excludeId,
      )
    ) {
      throw new ConflictException(
        `Ya existe una localidad con el nombre "${nombre}" en este escenario`,
      );
    }
  }
}

