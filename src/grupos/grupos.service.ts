import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Equipo } from '../equipos/entities/equipo.entity';
import { Fase } from '../fases/entities/fase.entity';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { GrupoResponseDto } from './dto/grupo-response.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { Grupo } from './entities/grupo.entity';
import { GrupoMapper } from './mappers/grupo.mapper';
import { GruposRepository } from './repositories/grupos.repository';

@Injectable()
export class GruposService {
  constructor(
    @InjectRepository(Grupo)
    private readonly gruposRepository: Repository<Grupo>,
    @InjectRepository(Fase)
    private readonly fasesRepository: Repository<Fase>,
    private readonly customGruposRepository: GruposRepository,
  ) {}

  async create(dto: CreateGrupoDto): Promise<GrupoResponseDto> {
    const fase = await this.findFase(dto.faseId);
    return this.gruposRepository.manager.transaction(async (manager) => {
      const selectedTeams = dto.equipoIds?.length
        ? await manager.getRepository(Equipo).find({
            where: { id: In(dto.equipoIds) },
            relations: { grupo: true },
          })
        : [];
      if (selectedTeams.length !== (dto.equipoIds?.length ?? 0)) {
        throw new NotFoundException('Uno o más equipos seleccionados no existen');
      }
      const alreadyAssignedTeam = selectedTeams.find((equipo) => equipo.grupo);
      if (alreadyAssignedTeam) {
        throw new ConflictException(
          `El equipo ${alreadyAssignedTeam.nombre} ya está asignado a un grupo`,
        );
      }
      this.validateEquiposActivos(selectedTeams);

      const saved = await manager.getRepository(Grupo).save(GrupoMapper.toEntity(dto, fase));
      selectedTeams.forEach((equipo) => {
        equipo.grupo = saved;
      });
      if (selectedTeams.length) {
        await manager.getRepository(Equipo).save(selectedTeams);
      }
      return GrupoMapper.toResponseDto(saved);
    });
  }

  async findAll(): Promise<GrupoResponseDto[]> {
    const grupos = await this.gruposRepository.find({
      relations: { fase: true },
      order: { id: 'ASC' },
    });
    return GrupoMapper.toResponseDtoList(grupos);
  }

  async findOne(id: number): Promise<GrupoResponseDto> {
    return GrupoMapper.toResponseDto(await this.findGrupo(id));
  }

  async findEquipos(id: number) {
    const grupo = await this.customGruposRepository.findWithEquipos(id);
    if (!grupo) throw new NotFoundException(`No se encontró el grupo con id ${id}`);
    return grupo.equipos ?? [];
  }

  async update(id: number, dto: UpdateGrupoDto): Promise<GrupoResponseDto> {
    const grupo = await this.findGrupo(id);
    let fase: Fase | undefined;
    if (dto.faseId !== undefined) {
      fase = await this.findFase(dto.faseId);
    }
    return this.gruposRepository.manager.transaction(async (manager) => {
      const saved = await manager.getRepository(Grupo).save(
        GrupoMapper.mergeEntity(grupo, dto, fase),
      );

      if (dto.equipoIds !== undefined || dto.faseId !== undefined) {
        const equipoRepository = manager.getRepository(Equipo);
        const selectedTeams =
          dto.equipoIds === undefined
            ? await equipoRepository.find({
                where: { grupo: { id: saved.id } },
                relations: { grupo: true },
              })
            : dto.equipoIds.length
              ? await equipoRepository.find({
              where: { id: In(dto.equipoIds) },
              relations: { grupo: true },
                })
              : [];
        if (
          dto.equipoIds !== undefined &&
          selectedTeams.length !== dto.equipoIds.length
        ) {
          throw new NotFoundException('Uno o más equipos seleccionados no existen');
        }
        this.validateEquiposActivos(selectedTeams);

        const alreadyAssignedTeam = selectedTeams.find(
          (equipo) => equipo.grupo && equipo.grupo.id !== saved.id,
        );
        if (alreadyAssignedTeam) {
          throw new ConflictException(
            `El equipo ${alreadyAssignedTeam.nombre} ya está asignado a otro grupo`,
          );
        }

        if (dto.equipoIds === undefined) {
          return GrupoMapper.toResponseDto(saved);
        }

        const currentTeams = await equipoRepository.find({
          where: { grupo: { id: saved.id } },
          relations: { grupo: true },
        });
        const selectedIds = new Set(dto.equipoIds);
        const teamsToUnassign = currentTeams.filter(
          (equipo) => !selectedIds.has(equipo.id),
        );
        for (const equipo of teamsToUnassign) {
          equipo.grupo = null;
        }
        for (const equipo of selectedTeams) {
          equipo.grupo = saved;
        }
        if (teamsToUnassign.length || selectedTeams.length) {
          await equipoRepository.save([...teamsToUnassign, ...selectedTeams]);
        }
      }

      return GrupoMapper.toResponseDto(saved);
    });
  }

  async remove(id: number): Promise<{ message: string }> {
    const grupo = await this.findGrupo(id);
    if (await this.customGruposRepository.hasEquipos(id)) {
      throw new ConflictException(
        'No se puede eliminar un grupo que tenga equipos asignados',
      );
    }
    await this.gruposRepository.remove(grupo);
    return { message: `Grupo #${id} eliminado correctamente` };
  }

  private async findGrupo(id: number): Promise<Grupo> {
    const grupo = await this.gruposRepository.findOne({
      where: { id },
      relations: { fase: true },
    });
    if (!grupo) throw new NotFoundException(`No se encontró el grupo con id ${id}`);
    return grupo;
  }

  private async findFase(id: number): Promise<Fase> {
    const fase = await this.fasesRepository.findOneBy({ id });
    if (!fase) throw new NotFoundException(`No se encontró la fase con id ${id}`);
    return fase;
  }

  private validateEquiposActivos(equipos: Equipo[]): void {
    const equipoInactivo = equipos.find((equipo) => !equipo.activo);
    if (equipoInactivo) {
      throw new ConflictException(
        `El equipo ${equipoInactivo.nombre} está inactivo y no puede participar en una fase`,
      );
    }
  }
}
