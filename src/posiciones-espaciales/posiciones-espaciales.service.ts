import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Jugador } from '../jugadores/entities/jugador.entity';
import { Pelota } from '../pelotas/entities/pelota.entity';
import { CreatePosicionEspacialDto } from './dto/create-posicion-espacial.dto';
import { PosicionEspacialResponseDto } from './dto/posicion-espacial-response.dto';
import { UpdatePosicionEspacialDto } from './dto/update-posicion-espacial.dto';
import { PosicionEspacial } from './entities/posicion-espacial.entity';
import { PosicionEspacialMapper } from './mappers/posicion-espacial.mapper';

@Injectable()
export class PosicionesEspacialesService {
  constructor(
    @InjectRepository(PosicionEspacial) private readonly repository: Repository<PosicionEspacial>,
    @InjectRepository(Jugador) private readonly jugadores: Repository<Jugador>,
    @InjectRepository(Pelota) private readonly pelotas: Repository<Pelota>,
  ) {}
  async create(dto: CreatePosicionEspacialDto): Promise<PosicionEspacialResponseDto> {
    const [jugador, pelota] = await Promise.all([this.findJugador(dto.jugadorId), this.findPelota(dto.pelotaId)]);
    return PosicionEspacialMapper.toResponseDto(await this.repository.save(PosicionEspacialMapper.toEntity(dto, jugador, pelota)));
  }
  async findAll(): Promise<PosicionEspacialResponseDto[]> {
    return PosicionEspacialMapper.toResponseDtoList(await this.repository.find({ relations: { jugador: true, pelota: true }, order: { momento: 'DESC', id: 'DESC' } }));
  }
  async findOne(id: number): Promise<PosicionEspacialResponseDto> { return PosicionEspacialMapper.toResponseDto(await this.findPosition(id)); }
  async update(id: number, dto: UpdatePosicionEspacialDto): Promise<PosicionEspacialResponseDto> {
    const position = await this.findPosition(id);
    const jugador = dto.jugadorId !== undefined ? await this.findJugador(dto.jugadorId) : undefined;
    const pelota = dto.pelotaId !== undefined ? await this.findPelota(dto.pelotaId) : undefined;
    return PosicionEspacialMapper.toResponseDto(await this.repository.save(PosicionEspacialMapper.mergeEntity(position, dto, jugador, pelota)));
  }
  async remove(id: number): Promise<{ message: string }> {
    const position = await this.findPosition(id);
    await this.repository.remove(position);
    return { message: `Posicion espacial #${id} eliminada correctamente` };
  }
  private async findPosition(id: number): Promise<PosicionEspacial> {
    const item = await this.repository.findOne({ where: { id }, relations: { jugador: true, pelota: true } });
    if (!item) throw new NotFoundException(`No se encontro la posicion espacial con id ${id}`);
    return item;
  }
  private async findJugador(id: number): Promise<Jugador> { const item = await this.jugadores.findOneBy({ id }); if (!item) throw new NotFoundException(`No se encontro el jugador con id ${id}`); return item; }
  private async findPelota(id: number): Promise<Pelota> { const item = await this.pelotas.findOneBy({ id }); if (!item) throw new NotFoundException(`No se encontro la pelota con id ${id}`); return item; }
}
