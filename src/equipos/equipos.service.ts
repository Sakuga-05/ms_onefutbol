import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contrato } from '../contratos/entities/contrato.entity';
import { ContratoMapper } from '../contratos/mappers/contrato.mapper';
import { DeporteMapper } from '../deportes/mappers/deporte.mapper';
import { EquipoDeporte } from '../equipos-deportes/entities/equipo-deporte.entity';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { DeportesDeEquipoDto } from './dto/deportes-de-equipo.dto';
import { EquipoResponseDto } from './dto/equipo-response.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { Equipo } from './entities/equipo.entity';
import { EquipoMapper } from './mappers/equipo.mapper';
import { EquiposRepository } from './repositories/equipos.repository';
import { escudoPath } from './upload/escudo-upload.config';

export interface UploadedShield {
  filename: string;
}

@Injectable()
export class EquiposService {
  constructor(
    @InjectRepository(Equipo)
    private readonly equiposRepository: Repository<Equipo>,
    @InjectRepository(EquipoDeporte)
    private readonly equiposDeportesRepository: Repository<EquipoDeporte>,
    @InjectRepository(Contrato)
    private readonly contratosRepository: Repository<Contrato>,
    private readonly customEquiposRepository: EquiposRepository,
  ) {}

  async create(dto: CreateEquipoDto, file?: UploadedShield): Promise<EquipoResponseDto> {
    const saved = await this.equiposRepository.save(
      EquipoMapper.toEntity(dto, file ? escudoPath(file.filename) : null),
    );
    return EquipoMapper.toResponseDto(saved);
  }

  async findAll(): Promise<EquipoResponseDto[]> {
    return EquipoMapper.toResponseDtoList(await this.equiposRepository.find());
  }

  async findOne(id: number): Promise<EquipoResponseDto> {
    return EquipoMapper.toResponseDto(await this.findEquipo(id));
  }

  async findDeportes(id: number): Promise<DeportesDeEquipoDto> {
    const equipo = await this.findEquipo(id);
    const relaciones = await this.equiposDeportesRepository.find({
      where: { equipo: { id } },
      relations: { deporte: true },
      order: { id: 'ASC' },
    });
    return {
      equipoId: equipo.id,
      deportes: DeporteMapper.toResponseDtoList(
        relaciones.map((relacion) => relacion.deporte),
      ),
    };
  }

  async findJugadores(id: number) {
    await this.findEquipo(id);
    const contratos = await this.contratosRepository.find({
      where: { equipo: { id } },
      relations: { jugador: true, equipo: true },
      order: { activo: 'DESC', fechaInicio: 'DESC' },
    });
    return ContratoMapper.toResponseDtoList(contratos);
  }

  async update(id: number, dto: UpdateEquipoDto, file?: UploadedShield): Promise<EquipoResponseDto> {
    const equipo = await this.findEquipo(id);
    const saved = await this.equiposRepository.save(
      EquipoMapper.mergeEntity(
        equipo,
        dto,
        file ? escudoPath(file.filename) : undefined,
      ),
    );
    return EquipoMapper.toResponseDto(saved);
  }

  async remove(id: number): Promise<{ message: string }> {
    const equipo = await this.findEquipo(id);
    const { hasDeps, reason } = await this.customEquiposRepository.hasDependencies(id);
    if (hasDeps) {
      throw new ConflictException(
        `No se puede eliminar el equipo #${id}: ${reason}`,
      );
    }
    await this.equiposRepository.remove(equipo);
    return { message: `Equipo #${id} eliminado correctamente` };
  }

  //VALIDACIONES
  private async findEquipo(id: number): Promise<Equipo> {
    const equipo = await this.equiposRepository.findOneBy({ id });
    if (!equipo) {
      throw new NotFoundException(`No se encontro el equipo con id ${id}`);
    }
    return equipo;
  }
}
