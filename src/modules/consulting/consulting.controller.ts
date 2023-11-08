import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Query,
  Patch,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ResponseGenericDto } from '../../common/dto';
import { FnCreateConsultingService, FnFindConsultingService } from './services';
import {
  RegisterClientInternalException,
  RegisterConsultingInternalException,
} from 'src/exception';
import { RequestCreateConsultingDto, RequestGetConsultingDto } from './dto';
import { AccessGuard } from 'src/common/guards/access.guard';
import { RequiredPermisions, UserDecorator } from 'src/common/decorator';
import { Permision } from 'src/common/enums';
import { PermisionGuard } from 'src/common/guards/permision.guard';
import { IUserSession } from 'src/common/interfaces';
import { FnUpdateStatusConsultingService } from './services/fn-update-status-consulting.service';

@ApiBearerAuth()
@UseGuards(AccessGuard, PermisionGuard)
@Controller('consulting/v1.0')
export class ConsultingController {
  constructor(
    private readonly fnCreateConsulting: FnCreateConsultingService,
    private readonly fnFindConsulting: FnFindConsultingService,
    private readonly fnUpdateStatusConsulting: FnUpdateStatusConsultingService,
  ) {}

  @ApiCreatedResponse({
    description: 'The consulting has been successfully created.',
    type: ResponseGenericDto,
  })
  @ApiConflictResponse({
    description: 'The consulting has been failed by conflict',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Exception.',
    type: RegisterConsultingInternalException,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Exception.',
    type: RegisterClientInternalException,
  })
  @UseGuards(ThrottlerGuard)
  @RequiredPermisions(Permision.CONSULTING_WRITE)
  @Throttle()
  @Post('/')
  create(
    @UserDecorator() userSession: IUserSession,
    @Body() requestCreateConsultingDto: RequestCreateConsultingDto,
  ): Promise<ResponseGenericDto> {
    return this.fnCreateConsulting.execute(
      requestCreateConsultingDto,
      userSession,
    );
  }

  @ApiCreatedResponse({
    description: 'The consulting has been successfully find.',
    type: ResponseGenericDto,
  })
  @ApiConflictResponse({
    description: 'The consulting has been failed by conflict',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Exception.',
    type: RegisterConsultingInternalException,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Exception.',
    type: RegisterClientInternalException,
  })
  @UseGuards(ThrottlerGuard)
  @RequiredPermisions(Permision.CONSULTING_READ)
  @Throttle()
  @Get('/:idConsulting')
  getById(
    @Param('idConsulting') idConsulting: string,
  ): Promise<ResponseGenericDto> {
    return this.fnFindConsulting.execute(null, idConsulting);
  }

  @ApiCreatedResponse({
    description: 'The consulting has been successfully find.',
    type: ResponseGenericDto,
  })
  @ApiConflictResponse({
    description: 'The consulting has been failed by conflict',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Exception.',
    type: RegisterConsultingInternalException,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Exception.',
    type: RegisterClientInternalException,
  })
  @UseGuards(ThrottlerGuard)
  @RequiredPermisions(Permision.CONSULTING_READ)
  @Throttle()
  @Get('/')
  findAll(
    @Query() query: RequestGetConsultingDto
  ): Promise<ResponseGenericDto | [ResponseGenericDto]> {
    return this.fnFindConsulting.execute(query, null);
  }

  @ApiCreatedResponse({
    description: 'The consulting has been successfully update.',
    type: ResponseGenericDto,
  })
  @ApiConflictResponse({
    description: 'The consulting has been failed by conflict',
  })
  @UseGuards(ThrottlerGuard)
  @RequiredPermisions(Permision.CONSULTING_READ)
  @Throttle()
  @Patch(':idConsulting/status/:status')
  updateStatus(
    @Param('idConsulting') idConsulting: string,
    @Param('status') status: number,
  ): Promise<ResponseGenericDto> {
    return this.fnUpdateStatusConsulting.execute(idConsulting, status);
  }
}
