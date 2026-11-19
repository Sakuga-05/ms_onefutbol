import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aficionado } from '../aficionados/entities/aficionado.entity';
import { MetodoPagoAficionado } from '../metodos-pago-aficionados/entities/metodo-pago-aficionado.entity';
import { Partido } from '../partidos/entities/partido.entity';
import { CreateApuestaDto } from './dto/create-apuesta.dto';
import { ApuestaResponseDto } from './dto/apuesta-response.dto';
import { UpdateApuestaDto } from './dto/update-apuesta.dto';
import { Apuesta } from './entities/apuesta.entity';
import { ApuestaMapper } from './mappers/apuesta.mapper';
import { ApuestasRepository } from './repositories/apuestas.repository';

@Injectable()
export class ApuestasService {
  constructor(
    @InjectRepository(Apuesta)
    private readonly apuestasRepository: Repository<Apuesta>,
    @InjectRepository(Aficionado)
    private readonly aficionadosRepository: Repository<Aficionado>,
    @InjectRepository(Partido)
    private readonly partidosRepository: Repository<Partido>,
    @InjectRepository(MetodoPagoAficionado)
    private readonly metodosPagoAficionadosRepository: Repository<MetodoPagoAficionado>,
    private readonly customApuestasRepository: ApuestasRepository,
  ) {}

  async create(dto: CreateApuestaDto): Promise<ApuestaResponseDto> {
    const [aficionado, partido, metodoPagoAficionado] = await Promise.all([
      this.findAficionado(dto.aficionadoId),
      this.findPartido(dto.partidoId),
      this.findMetodoPagoAficionado(dto.metodoPagoAficionadoId),
    ]);

    await this.validateMetodoPagoOwnership(
      metodoPagoAficionado.id,
      aficionado.id,
    );

    const saved = await this.apuestasRepository.save(
      ApuestaMapper.toEntity(dto, aficionado, partido, metodoPagoAficionado),
    );
    return ApuestaMapper.toResponseDto(saved);
  }

  async findAll(): Promise<ApuestaResponseDto[]> {
    const apuestas = await this.apuestasRepository.find({
      relations: {
        aficionado: true,
        partido: true,
        metodoPagoAficionado: true,
      },
      order: { id: 'DESC' },
    });
    return ApuestaMapper.toResponseDtoList(apuestas);
  }

  async findOne(id: number): Promise<ApuestaResponseDto> {
    return ApuestaMapper.toResponseDto(await this.findApuesta(id));
  }

  async update(id: number, dto: UpdateApuestaDto): Promise<ApuestaResponseDto> {
    const apuesta = await this.findApuesta(id);

    let aficionado: Aficionado | undefined;
    let partido: Partido | undefined;
    let metodoPagoAficionado: MetodoPagoAficionado | undefined;

    if (dto.aficionadoId !== undefined) {
      aficionado = await this.findAficionado(dto.aficionadoId);
    }
    if (dto.partidoId !== undefined) {
      partido = await this.findPartido(dto.partidoId);
    }
    if (dto.metodoPagoAficionadoId !== undefined) {
      metodoPagoAficionado = await this.findMetodoPagoAficionado(
        dto.metodoPagoAficionadoId,
      );
    }

    const currentAficionadoId = aficionado ? aficionado.id : apuesta.aficionado.id;
    const currentMetodoId = metodoPagoAficionado
      ? metodoPagoAficionado.id
      : apuesta.metodoPagoAficionado.id;

    if (dto.aficionadoId !== undefined || dto.metodoPagoAficionadoId !== undefined) {
      await this.validateMetodoPagoOwnership(currentMetodoId, currentAficionadoId);
    }

    const saved = await this.apuestasRepository.save(
      ApuestaMapper.mergeEntity(
        apuesta,
        dto,
        aficionado,
        partido,
        metodoPagoAficionado,
      ),
    );
    return ApuestaMapper.toResponseDto(saved);
  }

  async remove(id: number): Promise<{ message: string }> {
    const apuesta = await this.findApuesta(id);
    await this.apuestasRepository.remove(apuesta);
    return { message: `Apuesta #${id} eliminada correctamente` };
  }

  // Validaciones
  private async findApuesta(id: number): Promise<Apuesta> {
    const apuesta = await this.apuestasRepository.findOne({
      where: { id },
      relations: {
        aficionado: true,
        partido: true,
        metodoPagoAficionado: true,
      },
    });
    if (!apuesta) {
      throw new NotFoundException(`No se encontró la apuesta con id ${id}`);
    }
    return apuesta;
  }

  private async findAficionado(id: number): Promise<Aficionado> {
    const aficionado = await this.aficionadosRepository.findOneBy({ id });
    if (!aficionado) {
      throw new NotFoundException(`No se encontró el aficionado con id ${id}`);
    }
    return aficionado;
  }

  private async findPartido(id: number): Promise<Partido> {
    const partido = await this.partidosRepository.findOneBy({ id });
    if (!partido) {
      throw new NotFoundException(`No se encontró el partido con id ${id}`);
    }
    return partido;
  }

  private async findMetodoPagoAficionado(id: number): Promise<MetodoPagoAficionado> {
    const metodo = await this.metodosPagoAficionadosRepository.findOne({
      where: { id },
      relations: { aficionado: true },
    });
    if (!metodo) {
      throw new NotFoundException(
        `No se encontró el método de pago de aficionado con id ${id}`,
      );
    }
    return metodo;
  }

  private async validateMetodoPagoOwnership(
    metodoPagoAficionadoId: number,
    aficionadoId: number,
  ): Promise<void> {
    const isOwner =
      await this.customApuestasRepository.isMetodoPagoBelongsToAficionado(
        metodoPagoAficionadoId,
        aficionadoId,
      );
    if (!isOwner) {
      throw new BadRequestException(
        'El método de pago indicado no pertenece al aficionado que realiza la apuesta o está inactivo',
      );
    }
  }
}

