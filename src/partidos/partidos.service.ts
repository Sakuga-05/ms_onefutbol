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

@Injectable()
export class PartidosService {
  constructor(
    @InjectRepository(Partido)
    private readonly partidosRepository: Repository<Partido>,
    @InjectRepository(Escenario)
    private readonly escenariosRepository: Repository<Escenario>,
    private readonly customPartidosRepository: PartidosRepository,
  ) {}

  async create(dto: CreatePartidoDto): Promise<PartidoResponseDto> {
    const escenario = await this.findEscenario(dto.escenarioId);

    const saved = await this.partidosRepository.save(
      PartidoMapper.toEntity(dto, escenario),
    );
    return PartidoMapper.toResponseDto(saved);
  }

  async findAll(): Promise<PartidoResponseDto[]> {
    const partidos = await this.partidosRepository.find({
      relations: { escenario: true },
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
    let escenario: Escenario | undefined = undefined;

    if (dto.escenarioId !== undefined) {
      escenario = await this.findEscenario(dto.escenarioId);
    }

    const saved = await this.partidosRepository.save(
      PartidoMapper.mergeEntity(partido, dto, escenario),
    );
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
      relations: { escenario: true },
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
}

