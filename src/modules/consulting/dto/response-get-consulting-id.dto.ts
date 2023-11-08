import { ApiProperty } from '@nestjs/swagger';

export class ResponseGetConsultingIdDto {
  @ApiProperty()
  idConsulting: string;

  @ApiProperty()
  client: string;

  @ApiProperty()
  dni: string;

  @ApiProperty()
  consultingNumber: string;

  @ApiProperty()
  formatDate: string;

  @ApiProperty()
  formatHour: string;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  email: string;
}
