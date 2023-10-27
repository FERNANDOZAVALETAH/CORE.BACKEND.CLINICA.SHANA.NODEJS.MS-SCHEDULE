import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResponseCreateConsultingDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  idConsulting: string;
}
