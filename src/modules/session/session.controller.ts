import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { AccessGuard } from 'src/common/guards/access.guard';
import { PermisionGuard } from 'src/common/guards/permision.guard';
import { FnCreateSessionService } from './services/fn-create-sessions.service';
import { ResponseGenericDto } from 'src/common/dto';
import { RegisterSessionInternalException } from 'src/exception';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { RequiredPermisions, UserDecorator } from 'src/common/decorator';
import { Permision } from 'src/common/enums';
import { IUserSession } from 'src/common/interfaces';
import { RequestCreateSessionDto } from './dto';

@ApiBearerAuth()
@UseGuards(AccessGuard, PermisionGuard)
@Controller('session/v1.0')
export class SessionController {
  constructor(
    private readonly fnCreateSessionService: FnCreateSessionService,
  ) {}

  @ApiCreatedResponse({
    description: 'The session has been successfully created.',
    type: ResponseGenericDto,
  })
  @ApiConflictResponse({
    description: 'The session has been failed by conflict',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Exception.',
    type: RegisterSessionInternalException,
  })
  @UseGuards(ThrottlerGuard)
  @RequiredPermisions(Permision.SESSION_WRITE)
  @Throttle()
  @Post('/:idConsulting')
  create(
    @Param('idConsulting') idConsulting: string,
    @UserDecorator() userSession: IUserSession,
    @Body() requestCreateSessionDto: RequestCreateSessionDto,
  ): Promise<ResponseGenericDto> {
    return this.fnCreateSessionService.execute(
      idConsulting,
      requestCreateSessionDto,
      userSession,
    );
  }
}
