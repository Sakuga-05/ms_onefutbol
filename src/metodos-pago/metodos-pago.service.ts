import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto';
import { MetodoPagoResponseDto } from './dto/metodo-pago-response.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto';
import { MetodoPago } from './entities/metodo-pago.entity';
import { MetodoPagoMapper } from './mappers/metodo-pago.mapper';
import { MetodosPagoRepository } from './repositories/metodos-pago.repository';

@Injectable()
export class MetodosPagoService {
  constructor(
    @InjectRepository(MetodoPago)
    private readonly metodosPagoRepository: Repository<MetodoPago>,
    private readonly customMetodosPagoRepository: MetodosPagoRepository,
  ) {}

  async create(dto: CreateMetodoPagoDto): Promise<MetodoPagoResponseDto> {
    await this.validateUniqueName(dto.nombre);
    const saved = await this.metodosPagoRepository.save(
      MetodoPagoMapper.toEntity(dto),
    );
    return MetodoPagoMapper.toResponseDto(saved);
  }

  async findAll(): Promise<MetodoPagoResponseDto[]> {
    const metodos = await this.metodosPagoRepository.find({
      order: { id: 'ASC' },
    });
    return MetodoPagoMapper.toResponseDtoList(metodos);
  }

  async findOne(id: number): Promise<MetodoPagoResponseDto> {
    return MetodoPagoMapper.toResponseDto(await this.findMetodoPago(id));
  }

  async update(id: number, dto: UpdateMetodoPagoDto): Promise<MetodoPagoResponseDto> {
    const metodo = await this.findMetodoPago(id);
    if (dto.nombre !== undefined) {
      await this.validateUniqueName(dto.nombre, id);
    }

    const saved = await this.metodosPagoRepository.save(
      MetodoPagoMapper.mergeEntity(metodo, dto),
    );
    return MetodoPagoMapper.toResponseDto(saved);
  }

  async remove(id: number): Promise<{ message: string }> {
    const metodo = await this.findMetodoPago(id);
    if (await this.customMetodosPagoRepository.hasAficionados(id)) {
      throw new ConflictException(
        'No se puede eliminar un método de pago asociado a aficionados',
      );
    }

    await this.metodosPagoRepository.remove(metodo);
    return { message: `Método de pago #${id} eliminado correctamente` };
  }

  // Validaciones
  private async findMetodoPago(id: number): Promise<MetodoPago> {
    const metodo = await this.metodosPagoRepository.findOneBy({ id });
    if (!metodo) {
      throw new NotFoundException(`No se encontró el método de pago con id ${id}`);
    }
    return metodo;
  }

  private async validateUniqueName(nombre: string, excludeId?: number): Promise<void> {
    if (await this.customMetodosPagoRepository.existsByName(nombre, excludeId)) {
      throw new ConflictException(
        `Ya existe un método de pago con el nombre "${nombre}"`,
      );
    }
  }
}

