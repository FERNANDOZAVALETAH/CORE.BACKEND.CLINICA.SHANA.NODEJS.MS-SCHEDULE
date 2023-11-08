import { InternalServerErrorException } from '@nestjs/common';
import { GENERAL } from '../const/general.const';

export class ExecuteInternalException extends InternalServerErrorException {
  constructor(process: string) {
    super(`${GENERAL.EXCEPTION_CODE.EXECUTE}=>${process}`);
  }
}

export class RegisterConsultingInternalException extends InternalServerErrorException {
  constructor() {
    super(`${GENERAL.EXCEPTION_CODE.REGISTER_CONSULTING}`);
  }
}

export class RegisterClientInternalException extends InternalServerErrorException {
  constructor() {
    super(`${GENERAL.EXCEPTION_CODE.REGISTER_CLIENT}`);
  }
}

export class RegisterLogConsultingInternalException extends InternalServerErrorException {
  constructor() {
    super(`${GENERAL.EXCEPTION_CODE.REGISTER_LOG_CONSULTING}`);
  }
}

export class RegisterHomeConsultingInternalException extends InternalServerErrorException {
  constructor() {
    super(`${GENERAL.EXCEPTION_CODE.REGISTER_HOME_CONSULTING}`);
  }
}

export class RegisterCalendarConsultingInternalException extends InternalServerErrorException {
  constructor() {
    super(`${GENERAL.EXCEPTION_CODE.REGISTER_CALENDAR_CONSULTING}`);
  }
}

export class CreateAndUpdateSecuenceInternalException extends InternalServerErrorException {
  constructor() {
    super(`${GENERAL.EXCEPTION_CODE.CREATE_SECUENCE}`);
  }
}

export class RegisterSessionInternalException extends InternalServerErrorException {
  constructor() {
    super(`${GENERAL.EXCEPTION_CODE.REGISTER_SESSION}`);
  }
}
