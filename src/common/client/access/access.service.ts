import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientTCP } from '@nestjs/microservices';
import { GENERAL } from '../../../const/general.const';

@Injectable()
export class AccessService {
  private logger = new Logger(
    `::${GENERAL.CLIENT.ACCESS}::${AccessService.name}`,
  );

  constructor(
    @Inject(GENERAL.CLIENT.ACCESS)
    private readonly client: ClientTCP,
  ) {}

  callValidateExistsToken<TResult = any, TInput = any>(
    dto: TInput,
  ): Promise<TResult> {
    this.logger.debug(
      `execute::callValidateExistsToken::params${JSON.stringify(dto)}`,
    );
    const pattern = {
      subjet: 'client-security',
      function: 'validate-exist-token',
    };
    return this.client.send<TResult, TInput>(pattern, dto).toPromise();
  }

  callValidateExistsPermision<TResult = any, TInput = any>(
    dto: TInput,
  ): Promise<TResult> {
    this.logger.debug(
      `execute::callValidateExistsPermision::params${JSON.stringify(dto)}`,
    );
    const pattern = {
      subjet: 'client-security',
      function: 'validate-exist-permision',
    };
    return this.client.send<TResult, TInput>(pattern, dto).toPromise();
  }

  callFindUser<TResult = any, TInput = any>(dto: TInput): Promise<TResult> {
    this.logger.debug(`execute::callFindUser::params${JSON.stringify(dto)}`);
    const pattern = { subjet: 'client-security', function: 'find-user' };
    return this.client.send<TResult, TInput>(pattern, dto).toPromise();
  }
}
