import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateJugadorDto } from './dto/create-jugador.dto';
import { JugadorResponseDto } from './dto/jugador-response.dto';
import { UpdateJugadorDto } from './dto/update-jugador.dto';
import { Jugador } from './entities/jugador.entity';
import { JugadorMapper } from './mappers/jugador.mapper';
import { JugadoresRepository } from './repositories/jugadores.repository';

@Injectable()
export class JugadoresService {
  constructor(
    @InjectRepository(Jugador)
    private readonly repository: Repository<Jugador>,
    private readonly customRepository: JugadoresRepository,
  ) {}

  async create(dto: CreateJugadorDto): Promise<JugadorResponseDto> {
    if (dto.identificacion) {
      await this.validateUniqueDoc(dto.identificacion);
    }
    const saved = await this.repository.save(JugadorMapper.toEntity(dto));
    return JugadorMapper.toResponseDto(saved);
  }

  async findAll(): Promise<JugadorResponseDto[]> {
    return JugadorMapper.toResponseDtoList(
      await this.repository.find({ order: { id: 'ASC' } }),
    );
  }

  async findOne(id: number): Promise<JugadorResponseDto> {
    return JugadorMapper.toResponseDto(await this.findJugador(id));
  }

  async findEquipos(id: number) {
    await this.findJugador(id);
    const equipos = await this.customRepository.findEquiposWithContratos(id);
    return {
      jugadorId: id,
      totalEquipos: equipos.length,
      equipos,
      mensaje:
        equipos.length === 0
          ? 'El jugador no tiene equipos asociados'
          : undefined,
    };
  }

  async findHabilidades(id: number) {
    await this.findJugador(id);
    const habilidades = await this.customRepository.findHabilidadesWithNivel(id);
    return {
      jugadorId: id,
      totalHabilidades: habilidades.length,
      habilidades,
      mensaje:
        habilidades.length === 0
          ? 'El jugador no tiene habilidades registradas'
          : undefined,
    };
  }

  async findPerfil(id: number) {
    const jugador = await this.findJugador(id);
    const [equipos, habilidades] = await Promise.all([
      this.customRepository.findEquiposWithContratos(id),
      this.customRepository.findHabilidadesWithNivel(id),
    ]);

    return {
      jugador: JugadorMapper.toResponseDto(jugador),
      equipos,
      mensajeEquipos:
        equipos.length === 0
          ? 'El jugador no tiene equipos asociados'
          : null,
      habilidades,
      mensajeHabilidades:
        habilidades.length === 0
          ? 'El jugador no tiene habilidades registradas'
          : null,
    };
  }

  async update(id: number, dto: UpdateJugadorDto): Promise<JugadorResponseDto> {
    const jugador = await this.findJugador(id);
    if (dto.identificacion) {
      await this.validateUniqueDoc(dto.identificacion, id);
    }
    const saved = await this.repository.save(
      JugadorMapper.mergeEntity(jugador, dto),
    );
    return JugadorMapper.toResponseDto(saved);
  }

  async remove(id: number): Promise<{ message: string }> {
    const jugador = await this.findJugador(id);
    const { hasDeps, reason } = await this.customRepository.hasDependencies(id);
    if (hasDeps) {
      throw new ConflictException(
        `No se puede eliminar el jugador #${id}: ${reason}`,
      );
    }
    await this.repository.remove(jugador);
    return { message: `Jugador #${id} eliminado correctamente` };
  }

  private async findJugador(id: number): Promise<Jugador> {
    const jugador = await this.repository.findOneBy({ id });
    if (!jugador) {
      throw new NotFoundException(`No se encontró el jugador con id ${id}`);
    }
    return jugador;
  }

  private async validateUniqueDoc(
    identificacion: string,
    excludeId?: number,
  ): Promise<void> {
    if (
      await this.customRepository.existsByIdentificacion(
        identificacion.trim(),
        excludeId,
      )
    ) {
      throw new ConflictException(
        `Ya existe un jugador registrado con la identificación "${identificacion.trim()}"`,
      );
    }
  }
}
