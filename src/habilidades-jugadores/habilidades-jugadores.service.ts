import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habilidad } from '../habilidades/entities/habilidad.entity';
import { Jugador } from '../jugadores/entities/jugador.entity';
import { CreateHabilidadJugadorDto } from './dto/create-habilidad-jugador.dto';
import { HabilidadJugadorResponseDto } from './dto/habilidad-jugador-response.dto';
import { UpdateHabilidadJugadorDto } from './dto/update-habilidad-jugador.dto';
import { HabilidadJugador } from './entities/habilidad-jugador.entity';
import { HabilidadJugadorMapper } from './mappers/habilidad-jugador.mapper';
import { HabilidadesJugadoresRepository } from './repositories/habilidades-jugadores.repository';

@Injectable()
export class HabilidadesJugadoresService {
  constructor(
    @InjectRepository(HabilidadJugador) private readonly repository: Repository<HabilidadJugador>,
    @InjectRepository(Jugador) private readonly jugadores: Repository<Jugador>,
    @InjectRepository(Habilidad) private readonly habilidades: Repository<Habilidad>,
    private readonly custom: HabilidadesJugadoresRepository,
  ) {}
  async create(dto: CreateHabilidadJugadorDto): Promise<HabilidadJugadorResponseDto> {
    const [jugador, habilidad] = await Promise.all([this.findJugador(dto.jugadorId), this.findHabilidad(dto.habilidadId)]);
    await this.validateDuplicate(dto.jugadorId, dto.habilidadId);
    return HabilidadJugadorMapper.toResponseDto(await this.repository.save(HabilidadJugadorMapper.toEntity(dto, jugador, habilidad)));
  }
  async findAll(): Promise<HabilidadJugadorResponseDto[]> {
    return HabilidadJugadorMapper.toResponseDtoList(await this.repository.find({ relations: { jugador: true, habilidad: true }, order: { id: 'ASC' } }));
  }
  async findOne(id: number): Promise<HabilidadJugadorResponseDto> { return HabilidadJugadorMapper.toResponseDto(await this.findRelation(id)); }
  async update(id: number, dto: UpdateHabilidadJugadorDto): Promise<HabilidadJugadorResponseDto> {
    const relation = await this.findRelation(id);
    const jugador = dto.jugadorId !== undefined ? await this.findJugador(dto.jugadorId) : undefined;
    const habilidad = dto.habilidadId !== undefined ? await this.findHabilidad(dto.habilidadId) : undefined;
    await this.validateDuplicate(jugador?.id ?? relation.jugador.id, habilidad?.id ?? relation.habilidad.id, id);
    return HabilidadJugadorMapper.toResponseDto(await this.repository.save(HabilidadJugadorMapper.mergeEntity(relation, dto, jugador, habilidad)));
  }
  async remove(id: number): Promise<{ message: string }> {
    const relation = await this.findRelation(id);
    await this.repository.remove(relation);
    return { message: `Relacion habilidad-jugador #${id} eliminada correctamente` };
  }
  private async findRelation(id: number): Promise<HabilidadJugador> {
    const item = await this.repository.findOne({ where: { id }, relations: { jugador: true, habilidad: true } });
    if (!item) throw new NotFoundException(`No se encontro la relacion habilidad-jugador con id ${id}`);
    return item;
  }
  private async findJugador(id: number): Promise<Jugador> { const item = await this.jugadores.findOneBy({ id }); if (!item) throw new NotFoundException(`No se encontro el jugador con id ${id}`); return item; }
  private async findHabilidad(id: number): Promise<Habilidad> { const item = await this.habilidades.findOneBy({ id }); if (!item) throw new NotFoundException(`No se encontro la habilidad con id ${id}`); return item; }
  private async validateDuplicate(jugadorId: number, habilidadId: number, excludeId?: number) {
    if (await this.custom.existsByAssociation(jugadorId, habilidadId, excludeId)) throw new ConflictException('Ya existe esa relacion entre jugador y habilidad');
  }
}
