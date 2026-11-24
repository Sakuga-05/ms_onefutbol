import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export interface LiveNotification {
  type: 'ANOTACION' | 'PARTIDO_FINALIZADO';
  partidoId: number;
  message: string;
  data: Record<string, unknown>;
}

@WebSocketGateway({
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = (process.env.FRONTEND_ORIGINS ?? '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);

      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origen no permitido'), false);
    },
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  private server!: Server;

  handleConnection(client: Socket): void {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('subscribe_aficionado')
  async subscribeAficionado(
    @MessageBody() payload: { aficionadoId?: unknown },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const aficionadoId = payload?.aficionadoId;
    if (
      typeof aficionadoId !== 'number' ||
      !Number.isSafeInteger(aficionadoId) ||
      aficionadoId <= 0
    ) {
      throw new WsException('aficionadoId debe ser un entero positivo');
    }

    await client.join(this.roomForAficionado(aficionadoId));
    client.emit('subscribed', { aficionadoId });
  }

  notifyAficionados(
    aficionadoIds: number[],
    notification: LiveNotification,
  ): void {
    for (const aficionadoId of new Set(aficionadoIds)) {
      this.server
        .to(this.roomForAficionado(aficionadoId))
        .emit('new_notification', notification);
    }
  }

  private roomForAficionado(aficionadoId: number): string {
    return `aficionado:${aficionadoId}`;
  }
}
