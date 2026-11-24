import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Escenario } from '../escenarios/entities/escenario.entity';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { PartidoResponseDto } from './dto/partido-response.dto';
import { UpdatePartidoDto } from './dto/update-partido.dto';
import { Partido } from './entities/partido.entity';
import { PartidoMapper } from './mappers/partido.mapper';
import { PartidosRepository } from './repositories/partidos.repository';
import { Equipo } from '../equipos/entities/equipo.entity';
import { Fase } from '../fases/entities/fase.entity';
import { NotificationsService } from '../gateways/notifications/notifications.service';

@Injectable()
export class PartidosService {
  constructor(
    @InjectRepository(Partido)
    private readonly partidosRepository: Repository<Partido>,
    @InjectRepository(Escenario)
    private readonly escenariosRepository: Repository<Escenario>,
    @InjectRepository(Equipo)
    private readonly equiposRepository: Repository<Equipo>,
    @InjectRepository(Fase)
    private readonly fasesRepository: Repository<Fase>,
    private readonly customPartidosRepository: PartidosRepository,
    private readonly notifications: NotificationsService,
  ) {}

  async create(dto: CreatePartidoDto): Promise<PartidoResponseDto> {
    const escenario = await this.findEscenario(dto.escenarioId);
    const fase = await this.findFase(dto.faseId);
    if (dto.equipoLocalId === dto.equipoVisitanteId) {
      throw new ConflictException('Un equipo no puede competir contra sí mismo');
    }
    const equipoLocal = await this.findEquipo(dto.equipoLocalId);
    const equipoVisitante = await this.findEquipo(dto.equipoVisitanteId);
    if (!equipoLocal.activo || !equipoVisitante.activo) {
      throw new ConflictException('Los equipos participantes deben estar activos');
    }
    this.validateFinishedResult(
      dto.estado ?? 'PROGRAMADO',
      dto.golesLocal,
      dto.golesVisitante,
      equipoLocal,
      equipoVisitante,
    );

    const saved = await this.partidosRepository.save(
      PartidoMapper.toEntity(dto, escenario, fase, equipoLocal, equipoVisitante),
    );
    if (this.hasFinalResult(saved)) {
      await this.notifications.notifyMatchFinished(saved);
    }
    return PartidoMapper.toResponseDto(saved);
  }

  async findAll(): Promise<PartidoResponseDto[]> {
    const partidos = await this.partidosRepository.find({
      relations: { escenario: true, fase: true, equipoLocal: true, equipoVisitante: true },
      order: { fechaHora: 'ASC' },
    });
    return PartidoMapper.toResponseDtoList(partidos);
  }

  async findOne(id: number): Promise<PartidoResponseDto> {
    return PartidoMapper.toResponseDto(await this.findPartido(id));
  }

  async findBoletos(id: number) {
    const partido = await this.customPartidosRepository.findWithBoletos(id);
    if (!partido) throw new NotFoundException(`No se encontró el partido con id ${id}`);
    return partido.boletos ?? [];
  }

  async findApuestas(id: number) {
    const partido = await this.customPartidosRepository.findWithApuestas(id);
    if (!partido) throw new NotFoundException(`No se encontró el partido con id ${id}`);
    return partido.apuestas ?? [];
  }

  async update(id: number, dto: UpdatePartidoDto): Promise<PartidoResponseDto> {
    const partido = await this.findPartido(id);
    const hadFinalResult = this.hasFinalResult(partido);
    let escenario: Escenario | undefined = undefined;

    if (dto.escenarioId !== undefined) {
      escenario = await this.findEscenario(dto.escenarioId);
    }
    let fase: Fase | undefined;
    if (dto.faseId !== undefined) fase = await this.findFase(dto.faseId);
    let equipoLocal: Equipo | undefined;
    if (dto.equipoLocalId !== undefined) equipoLocal = await this.findEquipo(dto.equipoLocalId);
    let equipoVisitante: Equipo | undefined;
    if (dto.equipoVisitanteId !== undefined) equipoVisitante = await this.findEquipo(dto.equipoVisitanteId);
    const localId = equipoLocal?.id ?? partido.equipoLocal?.id;
    const visitanteId = equipoVisitante?.id ?? partido.equipoVisitante?.id;
    if (localId && visitanteId && localId === visitanteId) {
      throw new ConflictException('Un equipo no puede competir contra sí mismo');
    }
    const equipoLocalParticipante = equipoLocal ?? partido.equipoLocal;
    const equipoVisitanteParticipante =
      equipoVisitante ?? partido.equipoVisitante;
    if (
      equipoLocalParticipante && !equipoLocalParticipante.activo ||
      equipoVisitanteParticipante && !equipoVisitanteParticipante.activo
    ) {
      throw new ConflictException('Los equipos participantes deben estar activos');
    }
    if (
      dto.estado !== undefined ||
      dto.golesLocal !== undefined ||
      dto.golesVisitante !== undefined
    ) {
      this.validateFinishedResult(
        dto.estado ?? partido.estado,
        dto.golesLocal !== undefined ? dto.golesLocal : partido.golesLocal,
        dto.golesVisitante !== undefined
          ? dto.golesVisitante
          : partido.golesVisitante,
        equipoLocalParticipante ?? null,
        equipoVisitanteParticipante ?? null,
      );
    }

    const saved = await this.partidosRepository.save(
      PartidoMapper.mergeEntity(partido, dto, escenario, fase, equipoLocal, equipoVisitante),
    );
    if (!hadFinalResult && this.hasFinalResult(saved)) {
      await this.notifications.notifyMatchFinished(saved);
    }
    return PartidoMapper.toResponseDto(saved);
  }

  async remove(id: number): Promise<{ message: string }> {
    const partido = await this.findPartido(id);
    if (await this.customPartidosRepository.hasBoletos(id)) {
      throw new ConflictException(
        'No se puede eliminar un partido que tenga boletos asociados',
      );
    }

    await this.partidosRepository.remove(partido);
    return { message: `Partido #${id} eliminado correctamente` };
  }

  // Validaciones
  private async findPartido(id: number): Promise<Partido> {
    const partido = await this.partidosRepository.findOne({
      where: { id },
      relations: { escenario: true, fase: true, equipoLocal: true, equipoVisitante: true },
    });
    if (!partido) {
      throw new NotFoundException(`No se encontró el partido con id ${id}`);
    }
    return partido;
  }

  private async findEscenario(id: number): Promise<Escenario> {
    const escenario = await this.escenariosRepository.findOneBy({ id });
    if (!escenario) {
      throw new NotFoundException(`No se encontró el escenario con id ${id}`);
    }
    return escenario;
  }

  private async findFase(id: number): Promise<Fase> {
    const fase = await this.fasesRepository.findOneBy({ id });
    if (!fase) throw new NotFoundException(`No se encontró la fase con id ${id}`);
    return fase;
  }

  private async findEquipo(id: number): Promise<Equipo> {
    const equipo = await this.equiposRepository.findOneBy({ id });
    if (!equipo) throw new NotFoundException(`No se encontró el equipo con id ${id}`);
    return equipo;
  }

  private validateFinishedResult(
    status: string,
    homeGoals: number | null | undefined,
    awayGoals: number | null | undefined,
    homeTeam: Equipo | null,
    awayTeam: Equipo | null,
  ): void {
    if (!this.isFinishedStatus(status)) {
      return;
    }
    if (
      homeGoals === null ||
      homeGoals === undefined ||
      awayGoals === null ||
      awayGoals === undefined ||
      !homeTeam ||
      !awayTeam
    ) {
      throw new ConflictException(
        'Para finalizar un partido debes registrar ambos equipos y sus goles',
      );
    }
  }

  private hasFinalResult(partido: Partido): boolean {
    return (
      this.isFinishedStatus(partido.estado) &&
      partido.golesLocal !== null &&
      partido.golesLocal !== undefined &&
      partido.golesVisitante !== null &&
      partido.golesVisitante !== undefined &&
      Boolean(partido.equipoLocal) &&
      Boolean(partido.equipoVisitante)
    );
  }

  private isFinishedStatus(status: string): boolean {
    return ['FINALIZADO', 'TERMINADO'].includes(status.trim().toUpperCase());
  }
}
