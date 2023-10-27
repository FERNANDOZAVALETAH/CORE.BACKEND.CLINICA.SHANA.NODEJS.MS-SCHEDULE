import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResponseGetConsultingDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  idConsulting: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  client: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  dni: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  consultingNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  consultingDate: string;
}
