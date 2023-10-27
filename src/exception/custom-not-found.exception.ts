import { NotFoundException } from '@nestjs/common';

export class SessionConsultingNotFoundException extends NotFoundException {
  constructor(idConsulting: string) {
    super(
      `No existe ninguna consulta para el siguiente idConsulting:${idConsulting}`,
    );
  }
}
