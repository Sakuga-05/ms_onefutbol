import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Escenario } from '../escenarios/entities/escenario.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import { CreateEscenarioTorneoDto } from './dto/create-escenario-torneo.dto';
import { EscenarioTorneoResponseDto } from './dto/escenario-torneo-response.dto';
import { UpdateEscenarioTorneoDto } from './dto/update-escenario-torneo.dto';
import { EscenarioTorneo } from './entities/escenario-torneo.entity';
import { EscenarioTorneoMapper } from './mappers/escenario-torneo.mapper';
import { EscenariosTorneosRepository } from './repositories/escenarios-torneos.repository';

@Injectable()
export class EscenariosTorneosService {
  constructor(
    @InjectRepository(EscenarioTorneo)
    private readonly escenariosTorneosRepository: Repository<EscenarioTorneo>,
    @InjectRepository(Escenario)
    private readonly escenariosRepository: Repository<Escenario>,
    @InjectRepository(Torneo)
    private readonly torneosRepository: Repository<Torneo>,
    private readonly customEscenariosTorneosRepository: EscenariosTorneosRepository,
  ) {}

  async create(dto: CreateEscenarioTorneoDto): Promise<EscenarioTorneoResponseDto> {
    const [escenario, torneo] = await Promise.all([
      this.findEscenario(dto.escenarioId),
      this.findTorneo(dto.torneoId),
    ]);
    await this.validateUniqueAssociation(escenario.id, torneo.id);

    const saved = await this.escenariosTorneosRepository.save(
      EscenarioTorneoMapper.toEntity(dto, escenario, torneo),
    );
    return EscenarioTorneoMapper.toResponseDto(saved);
  }

  async findAll(): Promise<EscenarioTorneoResponseDto[]> {
    const items = await this.escenariosTorneosRepository.find({
      relations: { escenario: true, torneo: true },
      order: { id: 'ASC' },
    });
    return EscenarioTorneoMapper.toResponseDtoList(items);
  }

  async findOne(id: number): Promise<EscenarioTorneoResponseDto> {
    return EscenarioTorneoMapper.toResponseDto(await this.findEscenarioTorneo(id));
  }

  async update(id: number, dto: UpdateEscenarioTorneoDto): Promise<EscenarioTorneoResponseDto> {
    const item = await this.findEscenarioTorneo(id);
    let escenario: Escenario | undefined;
    let torneo: Torneo | undefined;

    if (dto.escenarioId !== undefined) escenario = await this.findEscenario(dto.escenarioId);
    if (dto.torneoId !== undefined) torneo = await this.findTorneo(dto.torneoId);

    const currentEscenarioId = escenario ? escenario.id : item.escenario.id;
    const currentTorneoId = torneo ? torneo.id : item.torneo.id;

    if (dto.escenarioId !== undefined || dto.torneoId !== undefined) {
      await this.validateUniqueAssociation(currentEscenarioId, currentTorneoId, id);
    }

    const saved = await this.escenariosTorneosRepository.save(
      EscenarioTorneoMapper.mergeEntity(item, dto, escenario, torneo),
    );
    return EscenarioTorneoMapper.toResponseDto(saved);
  }

  async remove(id: number): Promise<{ message: string }> {
    const item = await this.findEscenarioTorneo(id);
    await this.escenariosTorneosRepository.remove(item);
    return { message: `Asignación de escenario a torneo #${id} eliminada correctamente` };
  }

  private async findEscenarioTorneo(id: number): Promise<EscenarioTorneo> {
    const item = await this.escenariosTorneosRepository.findOne({
      where: { id },
      relations: { escenario: true, torneo: true },
    });
    if (!item) throw new NotFoundException(`No se encontró la relación escenario-torneo con id ${id}`);
    return item;
  }

  private async findEscenario(id: number): Promise<Escenario> {
    const escenario = await this.escenariosRepository.findOneBy({ id });
    if (!escenario) throw new NotFoundException(`No se encontró el escenario con id ${id}`);
    return escenario;
  }

  private async findTorneo(id: number): Promise<Torneo> {
    const torneo = await this.torneosRepository.findOneBy({ id });
    if (!torneo) throw new NotFoundException(`No se encontró el torneo con id ${id}`);
    return torneo;
  }

  private async validateUniqueAssociation(escenarioId: number, torneoId: number, excludeId?: number): Promise<void> {
    if (await this.customEscenariosTorneosRepository.existsByEscenarioTorneo(escenarioId, torneoId, excludeId)) {
      throw new ConflictException('El escenario ya se encuentra asignado a este torneo');
    }
  }
}
