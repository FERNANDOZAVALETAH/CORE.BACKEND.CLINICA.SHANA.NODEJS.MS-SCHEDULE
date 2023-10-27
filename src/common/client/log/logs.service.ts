import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientTCP } from '@nestjs/microservices';
import { GENERAL } from '../../../const/general.const';

@Injectable()
export class LogService {
  private logger = new Logger(`::${GENERAL.CLIENT.LOGS}::${LogService.name}`);

  constructor(
    @Inject(GENERAL.CLIENT.LOGS)
    private readonly client: ClientTCP,
  ) {}

  callConsultingRegister<TResult = any, TInput = any>(
    dto: TInput,
  ): Promise<TResult> {
    this.logger.debug(
      `execute::callConsultingRegister::params${JSON.stringify(dto)}`,
    );
    const pattern = { subjet: 'client-log', function: 'consulting/register' };
    return this.client.send<TResult, TInput>(pattern, dto).toPromise();
  }

  callSessionRegister<TResult = any, TInput = any>(
    dto: TInput,
  ): Promise<TResult> {
    this.logger.debug(
      `execute::callSessionRegister::params${JSON.stringify(dto)}`,
    );
    const pattern = { subjet: 'client-log', function: 'session/register' };
    return this.client.send<TResult, TInput>(pattern, dto).toPromise();
  }
}
