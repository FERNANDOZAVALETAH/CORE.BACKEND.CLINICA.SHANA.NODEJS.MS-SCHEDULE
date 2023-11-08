import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
  reason: string;

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

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  status: number;

}
