import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServiceUnavailableException } from '@nestjs/common';
import axios, { AxiosHeaders, AxiosResponse } from 'axios';
import { SecurityGuard } from './security.guard';

interface PermissionValidationResponse {
  allowed: boolean;
}

describe('SecurityGuard', () => {
  let guard: SecurityGuard;

  const createContext = (
    type: string,
    authorization?: string,
  ): ExecutionContext =>
    ({
      getType: () => type,
      switchToHttp: () => ({
        getRequest: () => ({
          path: '/aficionados',
          method: 'GET',
          headers: { authorization },
        }),
      }),
    }) as unknown as ExecutionContext;

  const permissionResponse = (
    allowed: boolean,
  ): AxiosResponse<PermissionValidationResponse> => ({
    data: { allowed },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

  beforeEach(() => {
    jest.restoreAllMocks();
    guard = new SecurityGuard(
      new ConfigService({ MS_SECURITY: 'http://localhost:8181/' }),
    );
  });

  it('rejects requests without a Bearer token', async () => {
    await expect(
      guard.canActivate(createContext('http')),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('sends the API path, method, and token for permission validation', async () => {
    const post = jest
      .spyOn(axios, 'post')
      .mockResolvedValue(permissionResponse(true));

    await expect(
      guard.canActivate(createContext('http', 'Bearer test-token')),
    ).resolves.toBe(true);

    expect(post).toHaveBeenCalledWith(
      'http://localhost:8181/api/internal/security/permissions-validation',
      { url: '/api/aficionados', method: 'GET' },
      {
        headers: { Authorization: 'Bearer test-token' },
        timeout: 5000,
      },
    );
  });

  it('rejects a denied permission', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue(permissionResponse(false));

    await expect(
      guard.canActivate(createContext('http', 'Bearer test-token')),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('fails closed when the security service is unavailable', async () => {
    jest.spyOn(axios, 'post').mockRejectedValue(new Error('offline'));

    await expect(
      guard.canActivate(createContext('http', 'Bearer test-token')),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('does not apply the HTTP permission contract to Socket.IO events', async () => {
    const post = jest.spyOn(axios, 'post');

    await expect(guard.canActivate(createContext('ws'))).resolves.toBe(true);
    expect(post).not.toHaveBeenCalled();
  });
});
