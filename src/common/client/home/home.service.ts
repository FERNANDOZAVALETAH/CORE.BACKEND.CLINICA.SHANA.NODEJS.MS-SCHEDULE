import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientTCP } from '@nestjs/microservices';
import { GENERAL } from '../../../const/general.const';

@Injectable()
export class HomeService {
  private logger = new Logger(`::${GENERAL.CLIENT.HOME}::${HomeService.name}`);

  constructor(
    @Inject(GENERAL.CLIENT.HOME)
    private readonly client: ClientTCP,
  ) {}

  callRegisterConsulting<TResult = any, TInput = any>(
    dto: TInput,
  ): Promise<TResult> {
    this.logger.debug(
      `execute::callRegisterConsulting::params${JSON.stringify(dto)}`,
    );
    const pattern = {
      subjet: 'client-home',
      function: 'register-consulting',
    };
    return this.client.send<TResult, TInput>(pattern, dto).toPromise();
  }

  callRegisterSession<TResult = any, TInput = any>(
    dto: TInput,
  ): Promise<TResult> {
    this.logger.debug(
      `execute::callRegisterSession::params${JSON.stringify(dto)}`,
    );
    const pattern = {
      subjet: 'client-home',
      function: 'register-session',
    };
    return this.client.send<TResult, TInput>(pattern, dto).toPromise();
  }
}
