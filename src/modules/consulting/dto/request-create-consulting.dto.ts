import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { DatePipe } from 'src/common/pipes';

export class RequestCreateConsultingDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsNumberString()
  @IsNotEmpty()
  @MaxLength(8, { message: 'El DNI debe ser maximo 8 caracteres' })
  @MinLength(8, { message: 'El DNI debe ser minimo 8 caracteres' })
  @ApiProperty()
  dni: string;

  @IsOptional()
  @ApiPropertyOptional()
  telephone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  reason: string;

  @IsString()
  @Validate(DatePipe)
  @ApiProperty()
  consultingDate: Date;
}
