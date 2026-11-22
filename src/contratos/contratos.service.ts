import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipo } from '../equipos/entities/equipo.entity';
import { Jugador } from '../jugadores/entities/jugador.entity';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { ContratoResponseDto } from './dto/contrato-response.dto';
import { UpdateContratoDto } from './dto/update-contrato.dto';
import { Contrato } from './entities/contrato.entity';
import { ContratoMapper } from './mappers/contrato.mapper';
import { ContratosRepository } from './repositories/contratos.repository';

@Injectable()
export class ContratosService {
  constructor(
    @InjectRepository(Contrato)
    private readonly contratosRepository: Repository<Contrato>,
    @InjectRepository(Jugador)
    private readonly jugadoresRepository: Repository<Jugador>,
    @InjectRepository(Equipo)
    private readonly equiposRepository: Repository<Equipo>,
    private readonly customRepository: ContratosRepository,
  ) {}

  async create(dto: CreateContratoDto): Promise<ContratoResponseDto> {
    this.validateDates(dto.fechaInicio, dto.fechaFin);
    const [jugador, equipo] = await Promise.all([
      this.findJugador(dto.jugadorId),
      this.findEquipo(dto.equipoId),
    ]);

    if (dto.activo !== false) {
      const hasActive = await this.customRepository.existsActiveContract(
        dto.jugadorId,
        dto.equipoId,
      );
      if (hasActive) {
        throw new ConflictException(
          'El jugador ya cuenta con un contrato activo en este equipo',
        );
      }
    }

    const saved = await this.contratosRepository.save(
      ContratoMapper.toEntity(dto, jugador, equipo),
    );
    return ContratoMapper.toResponseDto(saved);
  }

  async findAll(): Promise<ContratoResponseDto[]> {
    const contratos = await this.contratosRepository.find({
      relations: { jugador: true, equipo: true },
      order: { id: 'DESC' },
    });
    return ContratoMapper.toResponseDtoList(contratos);
  }

  async findOne(id: number): Promise<ContratoResponseDto> {
    return ContratoMapper.toResponseDto(await this.findContrato(id));
  }

  async update(id: number, dto: UpdateContratoDto): Promise<ContratoResponseDto> {
    const contrato = await this.findContrato(id);
    const fechaInicio = dto.fechaInicio ?? contrato.fechaInicio;
    const fechaFin = dto.fechaFin !== undefined ? dto.fechaFin : contrato.fechaFin;
    this.validateDates(fechaInicio, fechaFin ?? undefined);

    let jugador: Jugador | undefined;
    if (dto.jugadorId !== undefined) {
      jugador = await this.findJugador(dto.jugadorId);
    }

    let equipo: Equipo | undefined;
    if (dto.equipoId !== undefined) {
      equipo = await this.findEquipo(dto.equipoId);
    }

    const finalJugadorId = jugador?.id ?? contrato.jugador.id;
    const finalEquipoId = equipo?.id ?? contrato.equipo.id;
    const finalActivo = dto.activo !== undefined ? dto.activo : contrato.activo;

    if (finalActivo) {
      const hasActive = await this.customRepository.existsActiveContract(
        finalJugadorId,
        finalEquipoId,
        contrato.id,
      );
      if (hasActive) {
        throw new ConflictException(
          'El jugador ya cuenta con un contrato activo en este equipo',
        );
      }
    }

    const saved = await this.contratosRepository.save(
      ContratoMapper.mergeEntity(contrato, dto, jugador, equipo),
    );
    return ContratoMapper.toResponseDto(saved);
  }

  async finalizar(id: number): Promise<ContratoResponseDto> {
    const contrato = await this.findContrato(id);
    contrato.activo = false;
    if (!contrato.fechaFin) {
      contrato.fechaFin = new Date().toISOString().slice(0, 10);
    }
    const saved = await this.contratosRepository.save(contrato);
    return ContratoMapper.toResponseDto(saved);
  }

  async remove(id: number): Promise<{ message: string }> {
    const contrato = await this.findContrato(id);
    await this.contratosRepository.remove(contrato);
    return {
      message: `Contrato #${id} retirado correctamente (jugador y equipo permanecen en el sistema)`,
    };
  }

  async findByEquipo(equipoId: number): Promise<ContratoResponseDto[]> {
    await this.findEquipo(equipoId);
    const contratos = await this.customRepository.findByEquipo(equipoId);
    return ContratoMapper.toResponseDtoList(contratos);
  }

  async findByJugador(jugadorId: number): Promise<ContratoResponseDto[]> {
    await this.findJugador(jugadorId);
    const contratos = await this.customRepository.findByJugador(jugadorId);
    return ContratoMapper.toResponseDtoList(contratos);
  }

  private async findContrato(id: number): Promise<Contrato> {
    const contrato = await this.contratosRepository.findOne({
      where: { id },
      relations: { jugador: true, equipo: true },
    });
    if (!contrato) {
      throw new NotFoundException(`No se encontró el contrato con id ${id}`);
    }
    return contrato;
  }

  private async findJugador(id: number): Promise<Jugador> {
    const jugador = await this.jugadoresRepository.findOneBy({ id });
    if (!jugador) {
      throw new NotFoundException(`No se encontró el jugador con id ${id}`);
    }
    return jugador;
  }

  private async findEquipo(id: number): Promise<Equipo> {
    const equipo = await this.equiposRepository.findOneBy({ id });
    if (!equipo) {
      throw new NotFoundException(`No se encontró el equipo con id ${id}`);
    }
    return equipo;
  }

  private validateDates(fechaInicio: string, fechaFin?: string | null): void {
    if (fechaFin && fechaInicio > fechaFin) {
      throw new ConflictException(
        'La fecha de inicio no puede ser posterior a la fecha de fin',
      );
    }
  }
}
