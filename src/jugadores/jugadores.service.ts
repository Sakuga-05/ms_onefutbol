import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
    @InjectRepository(Jugador) private readonly repository: Repository<Jugador>,
    private readonly customRepository: JugadoresRepository,
  ) {}

  async create(dto: CreateJugadorDto): Promise<JugadorResponseDto> {
    const saved = await this.repository.save(JugadorMapper.toEntity(dto));
    return JugadorMapper.toResponseDto(saved);
  }
  async findAll(): Promise<JugadorResponseDto[]> {
    return JugadorMapper.toResponseDtoList(await this.repository.find({ order: { id: 'ASC' } }));
  }
  async findOne(id: number): Promise<JugadorResponseDto> {
    return JugadorMapper.toResponseDto(await this.findJugador(id));
  }
  async update(id: number, dto: UpdateJugadorDto): Promise<JugadorResponseDto> {
    const jugador = await this.findJugador(id);
    return JugadorMapper.toResponseDto(await this.repository.save(JugadorMapper.mergeEntity(jugador, dto)));
  }
  async remove(id: number): Promise<{ message: string }> {
    const jugador = await this.findJugador(id);
    if (await this.customRepository.hasAnotaciones(id)) {
      throw new ConflictException('No se puede eliminar un jugador que tenga anotaciones asociadas');
    }
    await this.repository.remove(jugador);
    return { message: `Jugador #${id} eliminado correctamente` };
  }
  private async findJugador(id: number): Promise<Jugador> {
    const jugador = await this.repository.findOneBy({ id });
    if (!jugador) throw new NotFoundException(`No se encontro el jugador con id ${id}`);
    return jugador;
  }
}
