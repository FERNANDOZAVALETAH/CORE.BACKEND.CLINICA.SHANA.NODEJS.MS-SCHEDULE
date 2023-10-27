import { UnauthorizedException } from '@nestjs/common';

export class PermisionDeniedUnauthorizedException extends UnauthorizedException {
  constructor(originException: string) {
    super(`Permisos insuficientes [${originException}]`);
  }
}
