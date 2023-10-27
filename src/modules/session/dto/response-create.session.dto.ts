import { ApiProperty } from '@nestjs/swagger';

export class ResponseCreateSessionDto {
  @ApiProperty()
  idConsulting: string;
}
