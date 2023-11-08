import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientTCP } from '@nestjs/microservices';
import { GENERAL } from '../../../const/general.const';

@Injectable()
export class UserService {
  private logger = new Logger(`::${GENERAL.CLIENT.USER}::${UserService.name}`);

  constructor(
    @Inject(GENERAL.CLIENT.USER)
    private readonly client: ClientTCP,
  ) {}

  callCalendarRegister<TResult = any, TInput = any>(
    dto: TInput,
  ): Promise<TResult> {
    this.logger.debug(
      `execute::callCalendarRegister::params${JSON.stringify(dto)}`,
    );
    const pattern = { subjet: 'client-user', function: 'calendar-register' };
    return this.client.send<TResult, TInput>(pattern, dto).toPromise();
  }

}
