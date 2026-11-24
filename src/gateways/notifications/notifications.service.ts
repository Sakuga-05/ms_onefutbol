import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import type { AnotacionResponseDto } from '../../anotaciones/dto/anotacion-response.dto';
import type { Partido } from '../../partidos/entities/partido.entity';
import {
  LiveNotification,
  NotificationsGateway,
} from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly gateway: NotificationsGateway,
  ) {}

  async notifyAnnotation(
    annotation: AnotacionResponseDto,
    jugador: { id: number; nombres: string; apellidos: string },
  ): Promise<void> {
    const jugadorNombre = `${jugador.nombres} ${jugador.apellidos}`;
    const notification: LiveNotification = {
      type: 'ANOTACION',
      partidoId: annotation.partidoId,
      message: `Nueva anotación al minuto ${annotation.minuto}`,
      data: {
        anotacion: annotation,
        jugador: { id: jugador.id, nombre: jugadorNombre },
      },
    };
    await this.notifyMatchRecipients(annotation.partidoId, notification);
  }

  async notifyMatchFinished(partido: Partido): Promise<void> {
    const equipoLocal = partido.equipoLocal;
    const equipoVisitante = partido.equipoVisitante;
    if (
      !equipoLocal ||
      !equipoVisitante ||
      partido.golesLocal === null ||
      partido.golesLocal === undefined ||
      partido.golesVisitante === null ||
      partido.golesVisitante === undefined
    ) {
      throw new Error(
        `No se puede notificar el resultado incompleto del partido #${partido.id}`,
      );
    }

    const fechaHora =
      partido.fechaHora instanceof Date
        ? partido.fechaHora.toISOString()
        : String(partido.fechaHora);
    const resultado = {
      equipoLocal: {
        id: equipoLocal.id,
        nombre: equipoLocal.nombre,
        goles: partido.golesLocal,
      },
      equipoVisitante: {
        id: equipoVisitante.id,
        nombre: equipoVisitante.nombre,
        goles: partido.golesVisitante,
      },
    };
    const anotaciones: Array<{
      minuto: number;
      tipo: string;
      descripcion: string | null;
      jugadorNombre: string;
      jugadorApellido: string;
    }> = await this.dataSource.query(
      `SELECT an.minuto, an.tipo, an.descripcion,
              j.nombres AS jugadorNombre, j.apellidos AS jugadorApellido
       FROM anotaciones an
       INNER JOIN jugadores j ON j.id = an.jugador_id
       WHERE an.partido_id = ?
       ORDER BY an.minuto ASC, an.id ASC`,
      [partido.id],
    );
    const notification: LiveNotification = {
      type: 'PARTIDO_FINALIZADO',
      partidoId: partido.id,
      message: `Resultado final: ${equipoLocal.nombre} ${partido.golesLocal} - ${partido.golesVisitante} ${equipoVisitante.nombre}`,
      data: { fechaHora, resultado, anotaciones },
    };
    await this.notifyMatchRecipients(partido.id, notification);
  }

  private async notifyMatchRecipients(
    partidoId: number,
    notification: LiveNotification,
  ): Promise<void> {
    const recipients: Array<{ id: number }> = await this.dataSource.query(
      `SELECT DISTINCT aficionado_id AS id
       FROM boletos
       WHERE partido_id = ?
       ORDER BY aficionado_id`,
      [partidoId],
    );

    if (recipients.length === 0) {
      return;
    }

    this.gateway.notifyAficionados(
      recipients.map((recipient) => Number(recipient.id)),
      notification,
    );
  }
}
