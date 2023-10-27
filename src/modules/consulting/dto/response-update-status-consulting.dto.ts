import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResponseUpdateStatusConsultingDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  idConsulting: string;
}
