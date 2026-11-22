import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipo } from '../equipos/entities/equipo.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { InscripcionResponseDto } from './dto/inscripcion-response.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { Inscripcion } from './entities/inscripcion.entity';
import { InscripcionMapper } from './mappers/inscripcion.mapper';
import { InscripcionesRepository } from './repositories/inscripciones.repository';

@Injectable()
export class InscripcionesService {
  constructor(
    @InjectRepository(Inscripcion)
    private readonly inscripcionesRepository: Repository<Inscripcion>,
    @InjectRepository(Torneo)
    private readonly torneosRepository: Repository<Torneo>,
    @InjectRepository(Equipo)
    private readonly equiposRepository: Repository<Equipo>,
    private readonly customInscripcionesRepository: InscripcionesRepository,
  ) {}

  async create(dto: CreateInscripcionDto): Promise<InscripcionResponseDto> {
    await this.validateUniqueNumeroRegistro(dto.numeroRegistro);
    const [torneo, equipo] = await Promise.all([
      this.findTorneo(dto.torneoId),
      this.findEquipo(dto.equipoId),
    ]);
    await this.validateUniqueAssociation(torneo.id, equipo.id);

    const saved = await this.inscripcionesRepository.save(
      InscripcionMapper.toEntity(dto, torneo, equipo),
    );
    return InscripcionMapper.toResponseDto(saved);
  }

  async findAll(): Promise<InscripcionResponseDto[]> {
    const inscripciones = await this.inscripcionesRepository.find({
      relations: { torneo: true, equipo: true },
      order: { id: 'ASC' },
    });
    return InscripcionMapper.toResponseDtoList(inscripciones);
  }

  async findOne(id: number): Promise<InscripcionResponseDto> {
    return InscripcionMapper.toResponseDto(await this.findInscripcion(id));
  }

  async update(id: number, dto: UpdateInscripcionDto): Promise<InscripcionResponseDto> {
    const inscripcion = await this.findInscripcion(id);

    if (dto.numeroRegistro !== undefined) {
      await this.validateUniqueNumeroRegistro(dto.numeroRegistro, id);
    }

    let torneo: Torneo | undefined;
    let equipo: Equipo | undefined;

    if (dto.torneoId !== undefined) torneo = await this.findTorneo(dto.torneoId);
    if (dto.equipoId !== undefined) equipo = await this.findEquipo(dto.equipoId);

    const currentTorneoId = torneo ? torneo.id : inscripcion.torneo.id;
    const currentEquipoId = equipo ? equipo.id : inscripcion.equipo.id;

    if (dto.torneoId !== undefined || dto.equipoId !== undefined) {
      await this.validateUniqueAssociation(currentTorneoId, currentEquipoId, id);
    }

    const saved = await this.inscripcionesRepository.save(
      InscripcionMapper.mergeEntity(inscripcion, dto, torneo, equipo),
    );
    return InscripcionMapper.toResponseDto(saved);
  }

  async remove(id: number): Promise<{ message: string }> {
    const inscripcion = await this.findInscripcion(id);
    await this.inscripcionesRepository.remove(inscripcion);
    return { message: `Inscripción #${id} eliminada correctamente` };
  }

  private async findInscripcion(id: number): Promise<Inscripcion> {
    const item = await this.inscripcionesRepository.findOne({
      where: { id },
      relations: { torneo: true, equipo: true },
    });
    if (!item) throw new NotFoundException(`No se encontró la inscripción con id ${id}`);
    return item;
  }

  private async findTorneo(id: number): Promise<Torneo> {
    const torneo = await this.torneosRepository.findOneBy({ id });
    if (!torneo) throw new NotFoundException(`No se encontró el torneo con id ${id}`);
    return torneo;
  }

  private async findEquipo(id: number): Promise<Equipo> {
    const equipo = await this.equiposRepository.findOneBy({ id });
    if (!equipo) throw new NotFoundException(`No se encontró el equipo con id ${id}`);
    return equipo;
  }

  private async validateUniqueAssociation(torneoId: number, equipoId: number, excludeId?: number): Promise<void> {
    if (await this.customInscripcionesRepository.existsByTorneoEquipo(torneoId, equipoId, excludeId)) {
      throw new ConflictException('El equipo ya se encuentra inscrito en este torneo');
    }
  }

  private async validateUniqueNumeroRegistro(numeroRegistro: string, excludeId?: number): Promise<void> {
    if (await this.customInscripcionesRepository.existsByNumeroRegistro(numeroRegistro, excludeId)) {
      throw new ConflictException(`Ya existe una inscripción con el número de registro "${numeroRegistro}"`);
    }
  }
}
