import { ApiProperty } from '@nestjs/swagger';
import { ResponseCreateConsultingDto, ResponseGetConsultingDto } from 'src/modules/consulting/dto';

export class ResponseGenericDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  operation: string;

  @ApiProperty()
  data: ResponseCreateConsultingDto | [ResponseGetConsultingDto];
}
