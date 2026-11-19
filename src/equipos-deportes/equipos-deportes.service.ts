import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Deporte } from '../deportes/entities/deporte.entity';
import { Equipo } from '../equipos/entities/equipo.entity';
import { CreateEquipoDeporteDto } from './dto/create-equipo-deporte.dto';
import { EquipoDeporteResponseDto } from './dto/equipo-deporte-response.dto';
import { UpdateEquipoDeporteDto } from './dto/update-equipo-deporte.dto';
import { EquipoDeporte } from './entities/equipo-deporte.entity';
import { EquipoDeporteMapper } from './mappers/equipo-deporte.mapper';
import { EquiposDeportesRepository } from './repositories/equipos-deportes.repository';

@Injectable()
export class EquiposDeportesService {
  constructor(
    @InjectRepository(EquipoDeporte)
    private readonly equiposDeportesRepository: Repository<EquipoDeporte>,
    @InjectRepository(Equipo)
    private readonly equiposRepository: Repository<Equipo>,
    @InjectRepository(Deporte)
    private readonly deportesRepository: Repository<Deporte>,
    private readonly customEquiposDeportesRepository: EquiposDeportesRepository,
  ) {}

  async create(dto: CreateEquipoDeporteDto): Promise<EquipoDeporteResponseDto> {
    const [equipo, deporte] = await Promise.all([
      this.findEquipo(dto.equipoId),
      this.findDeporte(dto.deporteId),
    ]);
    await this.ensureAssociationDoesNotExist(equipo.id, deporte.id);
    const saved = await this.saveAssociation(
      EquipoDeporteMapper.toEntity(dto, equipo, deporte),
    );
    return EquipoDeporteMapper.toResponseDto(saved);
  }

  async findAll(): Promise<EquipoDeporteResponseDto[]> {
    const relaciones = await this.equiposDeportesRepository.find({
      relations: { equipo: true, deporte: true },
    });
    return EquipoDeporteMapper.toResponseDtoList(relaciones);
  }

  async findOne(id: number): Promise<EquipoDeporteResponseDto> {
    return EquipoDeporteMapper.toResponseDto(await this.findRelacion(id));
  }

  async update(
    id: number,
    dto: UpdateEquipoDeporteDto,
  ): Promise<EquipoDeporteResponseDto> {
    const relacion = await this.findRelacion(id);
    if (dto.equipoId !== undefined) {
      relacion.equipo = await this.findEquipo(dto.equipoId);
    }
    if (dto.deporteId !== undefined) {
      relacion.deporte = await this.findDeporte(dto.deporteId);
    }
    await this.ensureAssociationDoesNotExist(
      relacion.equipo.id,
      relacion.deporte.id,
      id,
    );
    const saved = await this.saveAssociation(
      EquipoDeporteMapper.mergeEntity(relacion, dto),
    );
    return EquipoDeporteMapper.toResponseDto(saved);
  }

  async remove(id: number): Promise<{ message: string }> {
    const relacion = await this.findRelacion(id);
    await this.equiposDeportesRepository.remove(relacion);
    return { message: `Relacion #${id} eliminada correctamente` };
  }

  //VALIDACIONES
  private async findRelacion(id: number): Promise<EquipoDeporte> {
    const relacion = await this.equiposDeportesRepository.findOne({
      where: { id },
      relations: { equipo: true, deporte: true },
    });
    if (!relacion) {
      throw new NotFoundException(`No se encontro la relacion con id ${id}`);
    }
    return relacion;
  }

  private async findEquipo(id: number): Promise<Equipo> {
    const equipo = await this.equiposRepository.findOneBy({ id });
    if (!equipo) {
      throw new NotFoundException(`No se encontro el equipo con id ${id}`);
    }
    return equipo;
  }

  private async findDeporte(id: number): Promise<Deporte> {
    const deporte = await this.deportesRepository.findOneBy({ id });
    if (!deporte) {
      throw new NotFoundException(`No se encontro el deporte con id ${id}`);
    }
    return deporte;
  }

  private async ensureAssociationDoesNotExist(
    equipoId: number,
    deporteId: number,
    excludeId?: number,
  ): Promise<void> {
    if (
      await this.customEquiposDeportesRepository.existsByAssociation(
        equipoId,
        deporteId,
        excludeId,
      )
    ) {
      throw new ConflictException(
        'Ya existe una asociacion entre este equipo y este deporte',
      );
    }
  }

  private async saveAssociation(
    association: Partial<EquipoDeporte> | EquipoDeporte,
  ): Promise<EquipoDeporte> {
    try {
      return await this.equiposDeportesRepository.save(association);
    } catch (error) {
      if (this.isDuplicateAssociationError(error)) {
        throw new ConflictException(
          'Ya existe una asociacion entre este equipo y este deporte',
        );
      }
      throw error;
    }
  }

  private isDuplicateAssociationError(error: unknown): boolean {
    if (
      !(error instanceof QueryFailedError) ||
      typeof error.driverError !== 'object' ||
      error.driverError === null
    ) {
      return false;
    }

    const driverError = error.driverError as {
      code?: unknown;
      errno?: unknown;
    };
    return driverError.code === 'ER_DUP_ENTRY' || driverError.errno === 1062;
  }
}
