import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EquipoDeporte } from '../equipos-deportes/entities/equipo-deporte.entity';
import { EquipoMapper } from '../equipos/mappers/equipo.mapper';
import { EquiposDeDeporteDto } from './dto/equipos-de-deporte.dto';
import { CreateDeporteDto } from './dto/create-deporte.dto';
import { DeporteResponseDto } from './dto/deporte-response.dto';
import { UpdateDeporteDto } from './dto/update-deporte.dto';
import { Deporte } from './entities/deporte.entity';
import { DeporteMapper } from './mappers/deporte.mapper';
import { DeportesRepository } from './repositories/deportes.repository';

@Injectable()
export class DeportesService {
  constructor(
    @InjectRepository(Deporte)
    private readonly deportesRepository: Repository<Deporte>,
    @InjectRepository(EquipoDeporte)
    private readonly equiposDeportesRepository: Repository<EquipoDeporte>,
    private readonly customDeportesRepository: DeportesRepository,
  ) {}

  async create(dto: CreateDeporteDto): Promise<DeporteResponseDto> {
    this.validatePlayerRange(dto.minJugadores, dto.maxJugadores);
    await this.validateUniqueName(dto.nombre);
    const deportePadre = dto.deportePadreId == null ? null: await this.findParent(dto.deportePadreId);
    const saved = await this.deportesRepository.save(
      DeporteMapper.toEntity(dto, deportePadre),
    );
    return DeporteMapper.toResponseDto(saved);
  }

  async findAll(): Promise<DeporteResponseDto[]> {
    const deportes = await this.deportesRepository.find({
      relations: { deportePadre: true, subdeportes: true },
    });
    return DeporteMapper.toResponseDtoList(deportes);
  }

  async findOne(id: number): Promise<DeporteResponseDto> {
    return DeporteMapper.toResponseDto(await this.findDeporte(id));
  }

  async findEquipos(id: number): Promise<EquiposDeDeporteDto> {
    const deporte = await this.findDeporte(id);
    const relaciones = await this.equiposDeportesRepository.find({
      where: { deporte: { id } },
      relations: { equipo: true },
      order: { id: 'ASC' },
    });
    return {
      deporteId: deporte.id,
      equipos: EquipoMapper.toResponseDtoList(
        relaciones.map((relacion) => relacion.equipo),
      ),
    };
  }

  async update(id: number, dto: UpdateDeporteDto): Promise<DeporteResponseDto> {
    const deporte = await this.findDeporte(id);
    if (dto.nombre !== undefined) await this.validateUniqueName(dto.nombre, id);
    const minJugadores = dto.minJugadores ?? deporte.minJugadores;
    const maxJugadores = dto.maxJugadores ?? deporte.maxJugadores;
    this.validatePlayerRange(minJugadores, maxJugadores);

    if (dto.deportePadreId !== undefined) {
      deporte.deportePadre =
        dto.deportePadreId === null
          ? null
          : await this.findParent(dto.deportePadreId, deporte);
    }

    const saved = await this.deportesRepository.save(
      DeporteMapper.mergeEntity(deporte, dto),
    );
    return DeporteMapper.toResponseDto(saved);
  }

  async remove(id: number): Promise<{ message: string }> {
    const deporte = await this.findDeporte(id);
    const [hasChildren, hasTeams] = await Promise.all([
      this.deportesRepository.existsBy({ deportePadre: { id } }),
      this.equiposDeportesRepository.existsBy({ deporte: { id } }),
    ]);
    if (hasChildren || hasTeams) {
      throw new ConflictException(
        'No se puede eliminar un deporte que tenga subdeportes o equipos asociados',
      );
    }
    await this.deportesRepository.remove(deporte);
    return { message: `Deporte #${id} eliminado correctamente` };
  }

  //VALIDACIONES
  private async findDeporte(id: number): Promise<Deporte> {
    const deporte = await this.deportesRepository.findOne({
      where: { id },
      relations: { deportePadre: true, subdeportes: true },
    });
    if (!deporte) {
      throw new NotFoundException(`No se encontro el deporte con id ${id}`);
    }
    return deporte;
  }

  private async findParent(id: number, current?: Deporte): Promise<Deporte> {
    if (current?.id === id) {
      throw new ConflictException('Un deporte no puede ser su propio padre');
    }
    const parent = await this.deportesRepository.findOne({
      where: { id },
      relations: { deportePadre: true },
    });
    if (!parent) {
      throw new NotFoundException(
        `No se encontro el deporte padre con id ${id}`,
      );
    }
    if (parent.deportePadre) {
      throw new ConflictException(
        'La jerarquia de deportes solo admite dos niveles',
      );
    }
    if (
      current?.subdeportes?.length &&
      current.deportePadre?.id !== parent.id
    ) {
      throw new ConflictException(
        'No se puede asignar un padre a un deporte que ya tiene subdeportes',
      );
    }
    return parent;
  }

  private validatePlayerRange(min: number, max: number): void {
    if (min > max) {
      throw new ConflictException(
        'minJugadores debe ser menor o igual que maxJugadores',
      );
    }
  }

  private async validateUniqueName(nombre: string, excludeId?: number): Promise<void> {
    if (await this.customDeportesRepository.existsByName(nombre, excludeId)) {
      throw new ConflictException(
        `Ya existe un deporte con ese nommbre`,
      );
    }
  }
}
