import { BadRequestException } from '@nestjs/common';

export class FormatDateCustomException extends BadRequestException {
  constructor(message: string) {
    super(`${message}`);
  }
}
