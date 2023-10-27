import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwt_decode from 'jwt-decode';
import { AccessService } from '../client/access/access.service';
import { CryptoService } from '../crypto/crypto.service';
import { IUserSession } from '../interfaces';

@Injectable()
export class AccessGuard implements CanActivate {
  private logger = new Logger(`::${AccessGuard.name}::`);
  constructor(
    private readonly jwtService: JwtService,
    private readonly accessService: AccessService,
    private readonly cryptoService: CryptoService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.headers.authorization == undefined) {
      throw new UnauthorizedException();
    }
    const token = request.headers.authorization.split(' ')[1];
    try {
      const decryptToken = await this.cryptoService.decrypt(token);
      //this.jwtService.verifyAsync(decryptToken, { secret: GENERAL.JWT.SECRET });
      const validateToken = await this.accessService.callValidateExistsToken({
        token: decryptToken,
      });
      this.logger.debug(
        `execute::canActivate::validateToken[${validateToken}]`,
      );
      if (!validateToken) {
        throw new UnauthorizedException();
      }
      const decodedToken: any = jwt_decode(decryptToken);
      const userSession: IUserSession = await this.accessService.callFindUser({
        idUser: decodedToken.idUser,
      });
      this.logger.debug(
        `execute::canActivate::userSession[${JSON.stringify(userSession)}]`,
      );
      request.userSession = userSession;
      return true;
    } catch (error) {
      return false;
    }
  }
}
