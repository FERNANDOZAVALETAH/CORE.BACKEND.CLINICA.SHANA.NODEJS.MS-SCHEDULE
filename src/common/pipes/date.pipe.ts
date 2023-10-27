import { PipeTransform, Injectable } from '@nestjs/common';
import { FormatDateCustomException } from 'src/exception';

@Injectable()
export class DatePipe implements PipeTransform<string, Date> {
  transform(value: string): Date {
    const parsedDate = new Date(value);

    if (
      !parsedDate ||
      isNaN(parsedDate.getTime()) ||
      !/^([0-2]\d|3[0-1])-(0\d|1[0-2])-\d{4} \d{2}:\d{2}$/.test(value)
    ) {
      throw new FormatDateCustomException('El formato de fecha es incorrecto.');
    }

    return parsedDate;
  }
}
