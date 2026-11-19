import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aficionado } from '../aficionados/entities/aficionado.entity';
import { MetodoPago } from '../metodos-pago/entities/metodo-pago.entity';
import { CreateMetodoPagoAficionadoDto } from './dto/create-metodo-pago-aficionado.dto';
import { MetodoPagoAficionadoResponseDto } from './dto/metodo-pago-aficionado-response.dto';
import { UpdateMetodoPagoAficionadoDto } from './dto/update-metodo-pago-aficionado.dto';
import { MetodoPagoAficionado } from './entities/metodo-pago-aficionado.entity';
import { MetodoPagoAficionadoMapper } from './mappers/metodo-pago-aficionado.mapper';
import { MetodosPagoAficionadosRepository } from './repositories/metodos-pago-aficionados.repository';

@Injectable()
export class MetodosPagoAficionadosService {
  constructor(
    @InjectRepository(MetodoPagoAficionado)
    private readonly metodosPagoAficionadosRepository: Repository<MetodoPagoAficionado>,
    @InjectRepository(Aficionado)
    private readonly aficionadosRepository: Repository<Aficionado>,
    @InjectRepository(MetodoPago)
    private readonly metodosPagoRepository: Repository<MetodoPago>,
    private readonly customMetodosPagoAficionadosRepository: MetodosPagoAficionadosRepository,
  ) {}

  async create(
    dto: CreateMetodoPagoAficionadoDto,
  ): Promise<MetodoPagoAficionadoResponseDto> {
    const [aficionado, metodoPago] = await Promise.all([
      this.findAficionado(dto.aficionadoId),
      this.findMetodoPago(dto.metodoPagoId),
    ]);

    const saved = await this.metodosPagoAficionadosRepository.save(
      MetodoPagoAficionadoMapper.toEntity(dto, aficionado, metodoPago),
    );
    return MetodoPagoAficionadoMapper.toResponseDto(saved);
  }

  async findAll(): Promise<MetodoPagoAficionadoResponseDto[]> {
    const list = await this.metodosPagoAficionadosRepository.find({
      relations: { aficionado: true, metodoPago: true },
      order: { id: 'ASC' },
    });
    return MetodoPagoAficionadoMapper.toResponseDtoList(list);
  }

  async findOne(id: number): Promise<MetodoPagoAficionadoResponseDto> {
    return MetodoPagoAficionadoMapper.toResponseDto(
      await this.findMetodoAficionado(id),
    );
  }

  async update(
    id: number,
    dto: UpdateMetodoPagoAficionadoDto,
  ): Promise<MetodoPagoAficionadoResponseDto> {
    const metodoAficionado = await this.findMetodoAficionado(id);
    let aficionado: Aficionado | undefined;
    let metodoPago: MetodoPago | undefined;

    if (dto.aficionadoId !== undefined) {
      aficionado = await this.findAficionado(dto.aficionadoId);
    }
    if (dto.metodoPagoId !== undefined) {
      metodoPago = await this.findMetodoPago(dto.metodoPagoId);
    }

    const saved = await this.metodosPagoAficionadosRepository.save(
      MetodoPagoAficionadoMapper.mergeEntity(
        metodoAficionado,
        dto,
        aficionado,
        metodoPago,
      ),
    );
    return MetodoPagoAficionadoMapper.toResponseDto(saved);
  }

  async remove(id: number): Promise<{ message: string }> {
    const metodoAficionado = await this.findMetodoAficionado(id);
    if (await this.customMetodosPagoAficionadosRepository.hasApuestas(id)) {
      throw new ConflictException(
        'No se puede eliminar un método de pago de aficionado que tenga apuestas asociadas',
      );
    }

    await this.metodosPagoAficionadosRepository.remove(metodoAficionado);
    return {
      message: `Método de pago de aficionado #${id} eliminado correctamente`,
    };
  }

  // Validaciones
  private async findMetodoAficionado(id: number): Promise<MetodoPagoAficionado> {
    const item = await this.metodosPagoAficionadosRepository.findOne({
      where: { id },
      relations: { aficionado: true, metodoPago: true },
    });
    if (!item) {
      throw new NotFoundException(
        `No se encontró el método de pago de aficionado con id ${id}`,
      );
    }
    return item;
  }

  private async findAficionado(id: number): Promise<Aficionado> {
    const aficionado = await this.aficionadosRepository.findOneBy({ id });
    if (!aficionado) {
      throw new NotFoundException(`No se encontró el aficionado con id ${id}`);
    }
    return aficionado;
  }

  private async findMetodoPago(id: number): Promise<MetodoPago> {
    const metodo = await this.metodosPagoRepository.findOneBy({ id });
    if (!metodo) {
      throw new NotFoundException(`No se encontró el método de pago con id ${id}`);
    }
    return metodo;
  }
}

