import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aficionado } from '../aficionados/entities/aficionado.entity';
import { Equipo } from '../equipos/entities/equipo.entity';
import { CreateAficionadoEquipoDto } from './dto/create-aficionado-equipo.dto';
import { AficionadoEquipoResponseDto } from './dto/aficionado-equipo-response.dto';
import { UpdateAficionadoEquipoDto } from './dto/update-aficionado-equipo.dto';
import { AficionadoEquipo } from './entities/aficionado-equipo.entity';
import { AficionadoEquipoMapper } from './mappers/aficionado-equipo.mapper';
import { AficionadosEquiposRepository } from './repositories/aficionados-equipos.repository';

@Injectable()
export class AficionadosEquiposService {
  constructor(
    @InjectRepository(AficionadoEquipo) private readonly repository: Repository<AficionadoEquipo>,
    @InjectRepository(Aficionado) private readonly aficionados: Repository<Aficionado>,
    @InjectRepository(Equipo) private readonly equipos: Repository<Equipo>,
    private readonly custom: AficionadosEquiposRepository,
  ) {}
  async create(dto: CreateAficionadoEquipoDto): Promise<AficionadoEquipoResponseDto> {
    const [aficionado, equipo] = await Promise.all([this.findAficionado(dto.aficionadoId), this.findEquipo(dto.equipoId)]);
    await this.validateDuplicate(dto.aficionadoId, dto.equipoId);
    return AficionadoEquipoMapper.toResponseDto(await this.repository.save(AficionadoEquipoMapper.toEntity(dto, aficionado, equipo)));
  }
  async findAll(): Promise<AficionadoEquipoResponseDto[]> {
    return AficionadoEquipoMapper.toResponseDtoList(await this.repository.find({ relations: { aficionado: true, equipo: true }, order: { id: 'ASC' } }));
  }
  async findOne(id: number): Promise<AficionadoEquipoResponseDto> { return AficionadoEquipoMapper.toResponseDto(await this.findRelation(id)); }
  async update(id: number, dto: UpdateAficionadoEquipoDto): Promise<AficionadoEquipoResponseDto> {
    const relation = await this.findRelation(id);
    const aficionado = dto.aficionadoId !== undefined ? await this.findAficionado(dto.aficionadoId) : undefined;
    const equipo = dto.equipoId !== undefined ? await this.findEquipo(dto.equipoId) : undefined;
    await this.validateDuplicate(aficionado?.id ?? relation.aficionado.id, equipo?.id ?? relation.equipo.id, id);
    return AficionadoEquipoMapper.toResponseDto(await this.repository.save(AficionadoEquipoMapper.mergeEntity(relation, dto, aficionado, equipo)));
  }
  async remove(id: number): Promise<{ message: string }> {
    const relation = await this.findRelation(id);
    await this.repository.remove(relation);
    return { message: `Relacion aficionado-equipo #${id} eliminada correctamente` };
  }
  private async findRelation(id: number): Promise<AficionadoEquipo> {
    const item = await this.repository.findOne({ where: { id }, relations: { aficionado: true, equipo: true } });
    if (!item) throw new NotFoundException(`No se encontro la relacion aficionado-equipo con id ${id}`);
    return item;
  }
  private async findAficionado(id: number): Promise<Aficionado> { const item = await this.aficionados.findOneBy({ id }); if (!item) throw new NotFoundException(`No se encontro el aficionado con id ${id}`); return item; }
  private async findEquipo(id: number): Promise<Equipo> { const item = await this.equipos.findOneBy({ id }); if (!item) throw new NotFoundException(`No se encontro el equipo con id ${id}`); return item; }
  private async validateDuplicate(aficionadoId: number, equipoId: number, excludeId?: number) {
    if (await this.custom.existsByAssociation(aficionadoId, equipoId, excludeId)) throw new ConflictException('Ya existe una relacion entre ese aficionado y equipo');
  }
}
