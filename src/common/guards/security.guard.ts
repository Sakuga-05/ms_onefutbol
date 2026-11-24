import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { type AxiosResponse } from 'axios';
import type { Request } from 'express';

interface PermissionValidationResponse {
  allowed: boolean;
}

@Injectable()
export class SecurityGuard implements CanActivate {
  private readonly logger = new Logger(SecurityGuard.name);

  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'http') {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractBearerToken(request.headers.authorization);
    const securityBaseUrl = this.configService
      .get<string>('MS_SECURITY')
      ?.replace(/\/+$/, '');

    if (!securityBaseUrl) {
      this.logger.error('MS_SECURITY no está configurada');
      throw new ServiceUnavailableException(
        'Servicio de seguridad no configurado',
      );
    }

    let response: AxiosResponse<PermissionValidationResponse>;
    try {
      response = await axios.post<PermissionValidationResponse>(
        `${securityBaseUrl}/api/internal/security/permissions-validation`,
        {
          url: this.getPermissionUrl(request.path),
          method: request.method,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        this.logger.warn(
          `Validación de permisos rechazada: ${status ?? error.code ?? 'sin respuesta'}`,
        );

        if (status === 401) {
          throw new UnauthorizedException('Token inválido o expirado');
        }
        if (status === 403) {
          throw new ForbiddenException(
            'No tiene permiso para acceder a este recurso',
          );
        }
      } else {
        this.logger.error(
          'Error inesperado al consultar el servicio de seguridad',
          error instanceof Error ? error.stack : undefined,
        );
      }

      throw new ServiceUnavailableException(
        'Servicio de seguridad no disponible',
      );
    }

    if (typeof response.data?.allowed !== 'boolean') {
      this.logger.error('Respuesta inválida del servicio de seguridad');
      throw new ServiceUnavailableException(
        'Respuesta inválida del servicio de seguridad',
      );
    }

    if (!response.data.allowed) {
      throw new ForbiddenException(
        'No tiene permiso para acceder a este recurso',
      );
    }

    return true;
  }

  private extractBearerToken(authorization?: string): string {
    const match = /^Bearer\s+(\S+)$/i.exec(authorization ?? '');
    if (!match) {
      throw new UnauthorizedException(
        authorization
          ? 'Formato de Authorization inválido'
          : 'Token de autorización faltante',
      );
    }

    return match[1];
  }

  private getPermissionUrl(requestPath: string): string {
    const path = requestPath.startsWith('/') ? requestPath : `/${requestPath}`;
    return path === '/api' || path.startsWith('/api/')
      ? path
      : `/api${path}`;
  }
}
