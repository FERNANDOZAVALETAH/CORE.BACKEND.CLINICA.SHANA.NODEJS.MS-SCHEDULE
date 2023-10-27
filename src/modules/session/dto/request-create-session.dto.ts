import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, Validate } from 'class-validator';
import { DatePipe } from 'src/common/pipes';

class SessionDetails {
  @IsString()
  @Validate(DatePipe)
  @ApiProperty()
  scheduleDate: Date;
}

export class RequestCreateSessionDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: SessionDetails, isArray: true })
  sessionsDetails: [SessionDetails];
}
