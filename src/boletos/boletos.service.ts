import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aficionado } from '../aficionados/entities/aficionado.entity';
import { Localidad } from '../localidades/entities/localidad.entity';
import { Partido } from '../partidos/entities/partido.entity';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { BoletoResponseDto } from './dto/boleto-response.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';
import { Boleto } from './entities/boleto.entity';
import { BoletoMapper } from './mappers/boleto.mapper';
import { BoletosRepository } from './repositories/boletos.repository';

@Injectable()
export class BoletosService {
  constructor(
    @InjectRepository(Boleto)
    private readonly boletosRepository: Repository<Boleto>,
    @InjectRepository(Aficionado)
    private readonly aficionadosRepository: Repository<Aficionado>,
    @InjectRepository(Partido)
    private readonly partidosRepository: Repository<Partido>,
    @InjectRepository(Localidad)
    private readonly localidadesRepository: Repository<Localidad>,
    private readonly customBoletosRepository: BoletosRepository,
  ) {}

  async create(dto: CreateBoletoDto): Promise<BoletoResponseDto> {
    await this.validateUniqueCodigo(dto.codigo);

    const [aficionado, partido, localidad] = await Promise.all([
      this.findAficionado(dto.aficionadoId),
      this.findPartido(dto.partidoId),
      this.findLocalidad(dto.localidadId),
    ]);

    await this.validateLocalidadInPartidoEscenario(localidad.id, partido.id);

    const saved = await this.boletosRepository.save(
      BoletoMapper.toEntity(dto, aficionado, partido, localidad),
    );
    return BoletoMapper.toResponseDto(saved);
  }

  async findAll(): Promise<BoletoResponseDto[]> {
    const boletos = await this.boletosRepository.find({
      relations: {
        aficionado: true,
        partido: true,
        localidad: true,
      },
      order: { id: 'ASC' },
    });
    return BoletoMapper.toResponseDtoList(boletos);
  }

  async findOne(id: number): Promise<BoletoResponseDto> {
    return BoletoMapper.toResponseDto(await this.findBoleto(id));
  }

  async update(id: number, dto: UpdateBoletoDto): Promise<BoletoResponseDto> {
    const boleto = await this.findBoleto(id);

    if (dto.codigo !== undefined) {
      await this.validateUniqueCodigo(dto.codigo, id);
    }

    let aficionado: Aficionado | undefined;
    let partido: Partido | undefined;
    let localidad: Localidad | undefined;

    if (dto.aficionadoId !== undefined) {
      aficionado = await this.findAficionado(dto.aficionadoId);
    }
    if (dto.partidoId !== undefined) {
      partido = await this.findPartido(dto.partidoId);
    }
    if (dto.localidadId !== undefined) {
      localidad = await this.findLocalidad(dto.localidadId);
    }

    const currentPartidoId = partido ? partido.id : boleto.partido.id;
    const currentLocalidadId = localidad ? localidad.id : boleto.localidad.id;

    if (dto.partidoId !== undefined || dto.localidadId !== undefined) {
      await this.validateLocalidadInPartidoEscenario(
        currentLocalidadId,
        currentPartidoId,
      );
    }

    const saved = await this.boletosRepository.save(
      BoletoMapper.mergeEntity(boleto, dto, aficionado, partido, localidad),
    );
    return BoletoMapper.toResponseDto(saved);
  }

  async remove(id: number): Promise<{ message: string }> {
    const boleto = await this.findBoleto(id);
    await this.boletosRepository.remove(boleto);
    return { message: `Boleto #${id} eliminado correctamente` };
  }

  // Validaciones
  private async findBoleto(id: number): Promise<Boleto> {
    const boleto = await this.boletosRepository.findOne({
      where: { id },
      relations: {
        aficionado: true,
        partido: true,
        localidad: true,
      },
    });
    if (!boleto) {
      throw new NotFoundException(`No se encontró el boleto con id ${id}`);
    }
    return boleto;
  }

  private async findAficionado(id: number): Promise<Aficionado> {
    const aficionado = await this.aficionadosRepository.findOneBy({ id });
    if (!aficionado) {
      throw new NotFoundException(`No se encontró el aficionado con id ${id}`);
    }
    return aficionado;
  }

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

  private async findLocalidad(id: number): Promise<Localidad> {
    const localidad = await this.localidadesRepository.findOne({
      where: { id },
      relations: { escenario: true },
    });
    if (!localidad) {
      throw new NotFoundException(`No se encontró la localidad con id ${id}`);
    }
    return localidad;
  }

  private async validateUniqueCodigo(codigo: string, excludeId?: number): Promise<void> {
    if (await this.customBoletosRepository.existsByCodigo(codigo, excludeId)) {
      throw new ConflictException(`Ya existe un boleto con el código "${codigo}"`);
    }
  }

  private async validateLocalidadInPartidoEscenario(
    localidadId: number,
    partidoId: number,
  ): Promise<void> {
    const isValid =
      await this.customBoletosRepository.isLocalidadInPartidoEscenario(
        localidadId,
        partidoId,
      );
    if (!isValid) {
      throw new BadRequestException(
        'La localidad no pertenece al mismo escenario donde se desarrolla el partido',
      );
    }
  }
}

