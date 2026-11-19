import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAficionadoDto } from './dto/create-aficionado.dto';
import { AficionadoResponseDto } from './dto/aficionado-response.dto';
import { UpdateAficionadoDto } from './dto/update-aficionado.dto';
import { Aficionado } from './entities/aficionado.entity';
import { AficionadoMapper } from './mappers/aficionado.mapper';
import { AficionadosRepository } from './repositories/aficionados.repository';

@Injectable()
export class AficionadosService {
  constructor(
    @InjectRepository(Aficionado)
    private readonly aficionadosRepository: Repository<Aficionado>,
    private readonly customAficionadosRepository: AficionadosRepository,
  ) {}

  async create(dto: CreateAficionadoDto): Promise<AficionadoResponseDto> {
    await this.validateUniqueDocumento(dto.numeroDocumento);
    await this.validateUniqueEmail(dto.correoElectronico);

    const saved = await this.aficionadosRepository.save(
      AficionadoMapper.toEntity(dto),
    );
    return AficionadoMapper.toResponseDto(saved);
  }

  async findAll(): Promise<AficionadoResponseDto[]> {
    const aficionados = await this.aficionadosRepository.find({
      order: { id: 'ASC' },
    });
    return AficionadoMapper.toResponseDtoList(aficionados);
  }

  async findOne(id: number): Promise<AficionadoResponseDto> {
    return AficionadoMapper.toResponseDto(await this.findAficionado(id));
  }

  async findBoletos(id: number) {
    const aficionado = await this.customAficionadosRepository.findWithBoletos(id);
    if (!aficionado) throw new NotFoundException(`No se encontró el aficionado con id ${id}`);
    return aficionado.boletos ?? [];
  }

  async findMetodosPago(id: number) {
    const aficionado = await this.customAficionadosRepository.findWithMetodosPago(id);
    if (!aficionado) throw new NotFoundException(`No se encontró el aficionado con id ${id}`);
    return aficionado.metodosPago ?? [];
  }

  async findApuestas(id: number) {
    const aficionado = await this.customAficionadosRepository.findWithApuestas(id);
    if (!aficionado) throw new NotFoundException(`No se encontró el aficionado con id ${id}`);
    return aficionado.apuestas ?? [];
  }

  async update(id: number, dto: UpdateAficionadoDto): Promise<AficionadoResponseDto> {
    const aficionado = await this.findAficionado(id);
    if (dto.numeroDocumento !== undefined) {
      await this.validateUniqueDocumento(dto.numeroDocumento, id);
    }
    if (dto.correoElectronico !== undefined) {
      await this.validateUniqueEmail(dto.correoElectronico, id);
    }

    const saved = await this.aficionadosRepository.save(
      AficionadoMapper.mergeEntity(aficionado, dto),
    );
    return AficionadoMapper.toResponseDto(saved);
  }

  async remove(id: number): Promise<{ message: string }> {
    const aficionado = await this.findAficionado(id);
    if (await this.customAficionadosRepository.hasBoletos(id)) {
      throw new ConflictException(
        'No se puede eliminar un aficionado que tenga boletos asociados',
      );
    }

    await this.aficionadosRepository.remove(aficionado);
    return { message: `Aficionado #${id} eliminado correctamente` };
  }

  // Validaciones
  private async findAficionado(id: number): Promise<Aficionado> {
    const aficionado = await this.aficionadosRepository.findOneBy({ id });
    if (!aficionado) {
      throw new NotFoundException(`No se encontró el aficionado con id ${id}`);
    }
    return aficionado;
  }

  private async validateUniqueDocumento(
    numeroDocumento: string,
    excludeId?: number,
  ): Promise<void> {
    if (
      await this.customAficionadosRepository.existsByDocumento(
        numeroDocumento,
        excludeId,
      )
    ) {
      throw new ConflictException(
        `Ya existe un aficionado con el número de documento "${numeroDocumento}"`,
      );
    }
  }

  private async validateUniqueEmail(
    correoElectronico: string,
    excludeId?: number,
  ): Promise<void> {
    if (
      await this.customAficionadosRepository.existsByEmail(
        correoElectronico,
        excludeId,
      )
    ) {
      throw new ConflictException(
        `Ya existe un aficionado con el correo electrónico "${correoElectronico}"`,
      );
    }
  }
}

