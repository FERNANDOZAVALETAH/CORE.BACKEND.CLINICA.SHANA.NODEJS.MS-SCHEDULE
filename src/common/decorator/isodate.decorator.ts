import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsDDMMYYFormat(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isDDMMYYFormat',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
            const result = ((typeof value === 'string') && value.match(regex));
            return !!result
          },
          defaultMessage(args: ValidationArguments) {
            return `${args.property} debe tener el formato ddmmyyyy`;
          }
        },
      });
    };
  }