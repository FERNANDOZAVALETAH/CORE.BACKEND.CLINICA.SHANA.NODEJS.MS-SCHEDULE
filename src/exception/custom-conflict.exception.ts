import { ConflictException } from '@nestjs/common';

export class InvalidTokenCustomException extends ConflictException {
  constructor(tokenException: string, idUserException: string) {
    super(
      `token ingresado es incorrecto [token:${tokenException} idUser:${idUserException}]`,
    );
  }
}

export class SecuenceRegisterCustomException extends ConflictException {
  constructor(processCode: string) {
    super(`secuencia no registrada [${processCode}]`);
  }
}

export class ConsultingNotFoundException extends ConflictException {
  constructor() {
    super(`La consulta no existe para los filtros de busqueda seleccionados`);
  }
}

export class SessionRegisterCustomException extends ConflictException {
  constructor() {
    super(`No es posible registrar sesiones a esta consulta`);
  }
}
