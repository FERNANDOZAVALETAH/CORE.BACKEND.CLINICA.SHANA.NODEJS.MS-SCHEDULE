import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsDDMMYYFormat } from 'src/common/decorator/isodate.decorator';

export class RequestGetConsultingDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  status: string;

  @IsOptional()
  @IsString()
  @MaxLength(8, { message: 'El Numero Documento debe ser maximo 8 caracteres' })
  @ApiPropertyOptional()
  docNumber?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional()
  email?: string;

  @IsOptional()
  @IsDDMMYYFormat()
  @Transform(({ value }) => {
    const day = value.slice(0, 2);
    const month = value.slice(2, 4);
    const year = value.slice(4, 8);
    return `${day}/${month}/${year}`;
  })
  @ApiPropertyOptional()
  startDate?: string;

  @IsOptional()
  @IsDDMMYYFormat()
  @Transform(({ value }) => {
    const day = value.slice(0, 2);
    const month = value.slice(2, 4);
    const year = value.slice(4, 8);
    return `${day}/${month}/${year}`;
  })
  @ApiPropertyOptional()
  endDate?: string;
}
