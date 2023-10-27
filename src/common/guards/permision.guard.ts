import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessService } from '../client/access/access.service';
import { Permision } from '../enums';
import { PERMISIONS_KEY } from '../decorator';

@Injectable()
export class PermisionGuard implements CanActivate {
  private logger = new Logger(`::${PermisionGuard.name}::`);
  constructor(
    private reflector: Reflector,
    private readonly accessService: AccessService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Permision[]>(
      PERMISIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    this.logger.debug(
      `execute::canActivate::requiredRoles[${JSON.stringify(
        requiredRoles[0],
      )}]`,
    );
    if (!requiredRoles) {
      return true;
    }

    const userSession = context.switchToHttp().getRequest().userSession;
    const exitPermisions = await this.accessService.callValidateExistsPermision(
      { idUser: userSession.idUser, permision: requiredRoles[0] },
    );

    if (!exitPermisions) {
      throw new ForbiddenException();
    }

    return true;
  }
}
