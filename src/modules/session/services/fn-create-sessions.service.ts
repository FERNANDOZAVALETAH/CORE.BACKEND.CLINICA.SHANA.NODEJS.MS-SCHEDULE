import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { IUserSession } from 'src/common/interfaces';
import {
  Clients,
  ClientsDocument,
  Consultings,
  ConsultingsDocument,
} from 'src/common/schemas';
import { RequestCreateSessionDto } from '../dto';
import {
  ExecuteInternalException,
  SessionConsultingNotFoundException,
  SessionRegisterCustomException,
} from 'src/exception';
import { GENERAL } from 'src/const/general.const';
import { ResponseGenericDto } from 'src/common/dto';
import { ResponseCreateSessionDto } from '../dto/response-create.session.dto';
import { LogService } from 'src/common/client/log/logs.service';
import {
  ICreateConsultingSession,
  ICreateHomeSession,
  ICreateLogSession,
} from 'src/modules/session/interfaces';
import { HomeService } from 'src/common/client/home/home.service';

@Injectable()
export class FnCreateSessionService {
  private logger = new Logger(`::${FnCreateSessionService.name}::`);

  constructor(
    @InjectModel(Clients.name)
    private readonly clientModel: mongoose.Model<ClientsDocument>,
    @InjectModel(Consultings.name)
    private readonly consultingModel: mongoose.Model<ConsultingsDocument>,
    private readonly logsService: LogService,
    private readonly homeService: HomeService,
  ) {}

  async execute(
    idConsulting: string,
    requestCreateSessionDto: RequestCreateSessionDto,
    userSession: IUserSession,
  ): Promise<ResponseGenericDto> {
    this.logger.debug(
      `::execute::parameters::${JSON.stringify(requestCreateSessionDto.sessionsDetails.length)}`,
    );
    try {
      const consulting = await this.consultingModel.findById(idConsulting);

      if (!consulting) {
        throw new SessionConsultingNotFoundException(idConsulting);
      }

      const client = await this.clientModel.findById(consulting.idClient);

      if (
        consulting.status == GENERAL.CONSULTING.STATUS.ATTENDED &&
        !consulting.sessions.length
      ) {
        const { sessionsInHome, sessionsInConsulting } =
          this.generateSessionInHomeAndConsulting(
            requestCreateSessionDto,
            consulting,
            client,
            userSession.idUser,
          );

        await this.consultingModel.findByIdAndUpdate(consulting._id, {
          $set: { sessions: sessionsInConsulting },
        });

        const icreateLogSession: ICreateLogSession = {
          type: GENERAL.SESSION.CODE,
          idConsulting,
          consultingNumber: consulting.consultingNumber,
          quantitySessions: requestCreateSessionDto.sessionsDetails.length,
          createdUser: userSession.nickName,
        };
        this.logsService.callSessionRegister(icreateLogSession);

        this.homeService.callRegisterSession(sessionsInHome);

        return <ResponseGenericDto>{
          message: 'PE: Proceso exitoso',
          operation: `::${FnCreateSessionService.name}::execute`,
          data: <ResponseCreateSessionDto>{
            idConsulting,
          },
        };
      }
      throw new SessionRegisterCustomException();
    } catch (error) {
      this.logger.error(error);
      throw new ExecuteInternalException(`${FnCreateSessionService.name}`);
    }
  }

  private getLocalDateAndLocalTime(sessionDate: Date) {
    const formatDate: string = new Date(sessionDate).toLocaleDateString(
      'es-ES',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      },
    );

    const formatHour: string = new Date(sessionDate).toLocaleTimeString(
      'es-ES',
      {
        hour: '2-digit',
        minute: '2-digit',
      },
    );

    return { formatDate, formatHour };
  }

  private generateSessionInHomeAndConsulting(
    requestCreateSessionDto: RequestCreateSessionDto,
    consulting,
    client,
    idUser,
  ) {
    let nroSessions = 1;

    const sessionsInConsulting: ICreateConsultingSession[] = [];
    const sessionsInHome: ICreateHomeSession[] = [];

    for (const session of requestCreateSessionDto.sessionsDetails) {
      const { formatDate, formatHour } = this.getLocalDateAndLocalTime(
        session.scheduleDate,
      );
      const idSession = new mongoose.Types.ObjectId();
      let sessionNumber = nroSessions++;
      sessionsInConsulting.push({
        idSession,
        sessionNumber: String(sessionNumber),
        sessionDate: formatDate,
        sessionHour: formatHour,
        scheduleDate: session.scheduleDate,
        status: GENERAL.SESSION.STATUS.PENDING,
      });
      sessionsInHome.push({
        idConsulting: consulting._id,
        idSession: String(idSession),
        client: `${client.firstName} ${client.lastName}`,
        consultingNumber: consulting.consultingNumber,
        sessionNumber: String(sessionNumber),
        dni: client.dni,
        sessionDate: formatDate,
        sessionHour: formatHour,
        idUser: idUser,
        status: GENERAL.SESSION.STATUS.PENDING,
      });
    }
    return {
      sessionsInConsulting,
      sessionsInHome,
    };
  }
}
