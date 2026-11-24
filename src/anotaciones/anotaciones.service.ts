import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Contrato } from '../contratos/entities/contrato.entity';
import { Jugador } from '../jugadores/entities/jugador.entity';
import { Partido } from '../partidos/entities/partido.entity';
import { CreateAnotacionDto } from './dto/create-anotacion.dto';
import { AnotacionResponseDto } from './dto/anotacion-response.dto';
import { UpdateAnotacionDto } from './dto/update-anotacion.dto';
import { Anotacion } from './entities/anotacion.entity';
import { AnotacionMapper } from './mappers/anotacion.mapper';
import { AnotacionesRepository } from './repositories/anotaciones.repository';
import { NotificationsService } from '../gateways/notifications/notifications.service';

@Injectable()
export class AnotacionesService {
  constructor(
    @InjectRepository(Anotacion) private readonly repository: Repository<Anotacion>,
    @InjectRepository(Partido) private readonly partidos: Repository<Partido>,
    @InjectRepository(Jugador) private readonly jugadores: Repository<Jugador>,
    @InjectRepository(Contrato) private readonly contratos: Repository<Contrato>,
    private readonly custom: AnotacionesRepository,
    private readonly notifications: NotificationsService,
  ) {}
  async create(dto: CreateAnotacionDto): Promise<AnotacionResponseDto> {
    const [partido, jugador] = await Promise.all([this.findPartido(dto.partidoId), this.findJugador(dto.jugadorId)]);
    this.validateMatchInProgress(partido);
    await this.validatePlayerBelongsToMatch(partido, jugador.id);
    await this.validateDuplicate(dto, dto.partidoId, dto.jugadorId);
    const saved = await this.repository.save(
      AnotacionMapper.toEntity(dto, partido, jugador),
    );
    const response = AnotacionMapper.toResponseDto(saved);
    await this.notifications.notifyAnnotation(response, jugador);
    return response;
  }
  async findAll(): Promise<AnotacionResponseDto[]> {
    return AnotacionMapper.toResponseDtoList(await this.repository.find({ relations: { partido: true, jugador: true }, order: { id: 'ASC' } }));
  }
  async findOne(id: number): Promise<AnotacionResponseDto> { return AnotacionMapper.toResponseDto(await this.findOneEntity(id)); }
  async update(id: number, dto: UpdateAnotacionDto): Promise<AnotacionResponseDto> {
    const entity = await this.findOneEntity(id);
    this.validateMatchInProgress(entity.partido);
    const partido = dto.partidoId !== undefined ? await this.findPartido(dto.partidoId) : undefined;
    const jugador = dto.jugadorId !== undefined ? await this.findJugador(dto.jugadorId) : undefined;
    const targetPartido = partido ?? entity.partido;
    const targetJugador = jugador ?? entity.jugador;
    this.validateMatchInProgress(targetPartido);
    await this.validatePlayerBelongsToMatch(targetPartido, targetJugador.id);
    const partidoId = partido?.id ?? entity.partido.id;
    const jugadorId = targetJugador.id;
    const minuto = dto.minuto ?? entity.minuto;
    await this.validateDuplicate(dto, partidoId, jugadorId, id);
    return AnotacionMapper.toResponseDto(await this.repository.save(AnotacionMapper.mergeEntity(entity, dto, partido, jugador)));
  }
  async remove(id: number): Promise<{ message: string }> {
    const entity = await this.findOneEntity(id);
    this.validateMatchInProgress(entity.partido);
    await this.repository.remove(entity);
    return { message: `Anotacion #${id} eliminada correctamente` };
  }
  private async validateDuplicate(dto: CreateAnotacionDto | UpdateAnotacionDto, partidoId: number, jugadorId: number, excludeId?: number) {
    const minuto = dto.minuto;
    if (minuto !== undefined && await this.custom.exists(partidoId, jugadorId, minuto, excludeId)) throw new ConflictException('Ya existe una anotacion para ese partido, jugador y minuto');
  }
  private async findOneEntity(id: number): Promise<Anotacion> {
    const item = await this.repository.findOne({
      where: { id },
      relations: { partido: { equipoLocal: true, equipoVisitante: true }, jugador: true },
    });
    if (!item) throw new NotFoundException(`No se encontro la anotacion con id ${id}`);
    return item;
  }
  private async findPartido(id: number): Promise<Partido> {
    const item = await this.partidos.findOne({
      where: { id },
      relations: { equipoLocal: true, equipoVisitante: true },
    });
    if (!item) throw new NotFoundException(`No se encontro el partido con id ${id}`);
    return item;
  }
  private async findJugador(id: number): Promise<Jugador> {
    const item = await this.jugadores.findOneBy({ id });
    if (!item) throw new NotFoundException(`No se encontro el jugador con id ${id}`);
    return item;
  }

  private validateMatchInProgress(partido: Partido): void {
    if (partido.estado.trim().toUpperCase() !== 'EN PROCESO') {
      throw new ConflictException('Solo se pueden gestionar anotaciones cuando el partido está EN PROCESO');
    }
  }

  private async validatePlayerBelongsToMatch(partido: Partido, jugadorId: number): Promise<void> {
    const teamIds = [partido.equipoLocal?.id, partido.equipoVisitante?.id]
      .filter((id): id is number => id !== undefined && id !== null);
    if (!teamIds.length) {
      throw new BadRequestException('El partido debe tener equipos participantes para registrar anotaciones');
    }
    const activeContract = await this.contratos.findOne({
      where: {
        activo: true,
        jugador: { id: jugadorId },
        equipo: { id: In(teamIds) },
      },
    });
    if (!activeContract) {
      throw new BadRequestException('El jugador debe pertenecer a uno de los equipos participantes del partido');
    }
  }
}
