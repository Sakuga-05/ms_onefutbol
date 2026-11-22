import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Jugador } from '../jugadores/entities/jugador.entity';
import { Partido } from '../partidos/entities/partido.entity';
import { CreateAnotacionDto } from './dto/create-anotacion.dto';
import { AnotacionResponseDto } from './dto/anotacion-response.dto';
import { UpdateAnotacionDto } from './dto/update-anotacion.dto';
import { Anotacion } from './entities/anotacion.entity';
import { AnotacionMapper } from './mappers/anotacion.mapper';
import { AnotacionesRepository } from './repositories/anotaciones.repository';

@Injectable()
export class AnotacionesService {
  constructor(
    @InjectRepository(Anotacion) private readonly repository: Repository<Anotacion>,
    @InjectRepository(Partido) private readonly partidos: Repository<Partido>,
    @InjectRepository(Jugador) private readonly jugadores: Repository<Jugador>,
    private readonly custom: AnotacionesRepository,
  ) {}
  async create(dto: CreateAnotacionDto): Promise<AnotacionResponseDto> {
    const [partido, jugador] = await Promise.all([this.findPartido(dto.partidoId), this.findJugador(dto.jugadorId)]);
    await this.validateDuplicate(dto, dto.partidoId, dto.jugadorId);
    return AnotacionMapper.toResponseDto(await this.repository.save(AnotacionMapper.toEntity(dto, partido, jugador)));
  }
  async findAll(): Promise<AnotacionResponseDto[]> {
    return AnotacionMapper.toResponseDtoList(await this.repository.find({ relations: { partido: true, jugador: true }, order: { id: 'ASC' } }));
  }
  async findOne(id: number): Promise<AnotacionResponseDto> { return AnotacionMapper.toResponseDto(await this.findOneEntity(id)); }
  async update(id: number, dto: UpdateAnotacionDto): Promise<AnotacionResponseDto> {
    const entity = await this.findOneEntity(id);
    const partido = dto.partidoId !== undefined ? await this.findPartido(dto.partidoId) : undefined;
    const jugador = dto.jugadorId !== undefined ? await this.findJugador(dto.jugadorId) : undefined;
    const partidoId = partido?.id ?? entity.partido.id;
    const jugadorId = jugador?.id ?? entity.jugador.id;
    const minuto = dto.minuto ?? entity.minuto;
    await this.validateDuplicate(dto, partidoId, jugadorId, id);
    return AnotacionMapper.toResponseDto(await this.repository.save(AnotacionMapper.mergeEntity(entity, dto, partido, jugador)));
  }
  async remove(id: number): Promise<{ message: string }> {
    const entity = await this.findOneEntity(id);
    await this.repository.remove(entity);
    return { message: `Anotacion #${id} eliminada correctamente` };
  }
  private async validateDuplicate(dto: CreateAnotacionDto | UpdateAnotacionDto, partidoId: number, jugadorId: number, excludeId?: number) {
    const minuto = dto.minuto;
    if (minuto !== undefined && await this.custom.exists(partidoId, jugadorId, minuto, excludeId)) throw new ConflictException('Ya existe una anotacion para ese partido, jugador y minuto');
  }
  private async findOneEntity(id: number): Promise<Anotacion> {
    const item = await this.repository.findOne({ where: { id }, relations: { partido: true, jugador: true } });
    if (!item) throw new NotFoundException(`No se encontro la anotacion con id ${id}`);
    return item;
  }
  private async findPartido(id: number): Promise<Partido> {
    const item = await this.partidos.findOneBy({ id });
    if (!item) throw new NotFoundException(`No se encontro el partido con id ${id}`);
    return item;
  }
  private async findJugador(id: number): Promise<Jugador> {
    const item = await this.jugadores.findOneBy({ id });
    if (!item) throw new NotFoundException(`No se encontro el jugador con id ${id}`);
    return item;
  }
}
