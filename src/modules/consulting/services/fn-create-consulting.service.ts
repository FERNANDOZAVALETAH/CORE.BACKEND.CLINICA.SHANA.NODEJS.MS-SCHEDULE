import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { ResponseGenericDto } from 'src/common/dto';
import {
  Clients,
  ClientsDocument,
  Consultings,
  ConsultingsDocument,
  Secuences,
  SecuencesDocument,
} from 'src/common/schemas';
import {
  RequestCreateConsultingDto,
  ResponseCreateConsultingDto,
} from '../dto';
import {
  ICreateCalendarConsulting,
  ICreateClient,
  ICreateHomeConsulting,
  ICreateLogConsulting,
  ICreateSecuence,
} from '../interfaces';
import { GENERAL } from 'src/const/general.const';
import {
  CreateAndUpdateSecuenceInternalException,
  ExecuteInternalException,
  RegisterCalendarConsultingInternalException,
  RegisterClientInternalException,
  RegisterConsultingInternalException,
  RegisterHomeConsultingInternalException,
  RegisterLogConsultingInternalException,
  SecuenceRegisterCustomException,
} from 'src/exception';
import { ICreateConsulting } from '../interfaces/create-consulting.interface';
import { LogService } from 'src/common/client/log/logs.service';
import { IUserSession } from 'src/common/interfaces';
import { HomeService } from 'src/common/client/home/home.service';
import { UserService } from 'src/common/client/user/user.service';

@Injectable()
export class FnCreateConsultingService {
  private logger = new Logger(`::${FnCreateConsultingService.name}::`);

  constructor(
    @InjectModel(Clients.name)
    private readonly clientModel: mongoose.Model<ClientsDocument>,
    @InjectModel(Consultings.name)
    private readonly consultingModel: mongoose.Model<ConsultingsDocument>,
    @InjectModel(Secuences.name)
    private readonly secuenceModel: mongoose.Model<SecuencesDocument>,
    private readonly logsService: LogService,
    private readonly homeService: HomeService,
    private readonly userService: UserService
  ) {}

  async execute(
    requestCreateConsultingDto: RequestCreateConsultingDto,
    userSession: IUserSession,
  ): Promise<ResponseGenericDto> {
    this.logger.debug(
      `::execute::parameters::${JSON.stringify(requestCreateConsultingDto)}`,
    );

    try {
      let idConsulting = '';
      const { firstName, lastName, dni, telephone, reason, consultingDate, email } =
        requestCreateConsultingDto;

      const client = await this.clientModel.findOne({ dni });
      const secuence = await this.secuenceModel.findOne({
        processCode: GENERAL.SECUENCES.PROCESS_CODE,
      });
      if (!secuence) {
        throw new SecuenceRegisterCustomException(
          GENERAL.SECUENCES.PROCESS_CODE,
        );
      }
      const consultingNumber = await this.createAndUpdateSecuence({
        idSecuence: secuence._id,
        formatNumber: secuence.formatNumber,
        prefix: secuence.prefix,
        value: secuence.initValue,
      });
      if (!client) {
        const idClient = await this.createClient({
          firstName,
          lastName,
          dni,
          telephone,
        });
        idConsulting = await this.createConsulting({
          idClient,
          dni,
          email,
          fullName: `${firstName} ${lastName}`,
          reason,
          consultingDate,
          consultingNumber,
        });
      } else {
        idConsulting = await this.createConsulting({
          idClient: client._id,
          dni,
          email,
          fullName: `${firstName} ${lastName}`,
          reason,
          consultingDate,
          consultingNumber,
        });
      }

      const icreateLogConsulting: ICreateLogConsulting = {
        type: GENERAL.CONSULTING.CODE,
        idConsulting,
        consultingNumber,
        createdUser: userSession.nickName,
      };
      this.registerLogConsulting(icreateLogConsulting);

      const { formatDate, formatHour, formatHourAdd, day, month, year } =
        this.getLocalDateAndLocalTime(consultingDate);
      const icreateHomeConsulting: ICreateHomeConsulting = {
        idUser: userSession.idUser,
        idConsulting,
        consultingNumber,
        client: `${firstName} ${lastName}`,
        dni,
        consultingDate: formatDate,
        consultingHour: formatHour,
        reason,
        status: 1,
      };
      this.registerHomeConsulting(icreateHomeConsulting);

      const date = new Date(consultingDate);
      const formattedDate = date.toISOString().slice(0, 10);

      const start = `${formattedDate} ${formatHour}`;
      const end = `${formattedDate} ${formatHourAdd}`;
      const title = `${firstName} ${lastName} ${reason}`;

      const icreateCalendarConsulting: ICreateCalendarConsulting = {
        idConsulting,
        idUser: userSession.idUser,
        title: title,
        description: title,
        start,
        end,
        day,
        month,
        year,
        isConsulting: true
      }
      this.registerCalendarConsulting(icreateCalendarConsulting);

      return <ResponseGenericDto>{
        message: 'PE: Proceso exitoso',
        operation: `::${FnCreateConsultingService.name}::execute`,
        data: <ResponseCreateConsultingDto>{
          idConsulting,
        },
      };
    } catch (error) {
      this.logger.error(error);
      throw new ExecuteInternalException(`${FnCreateConsultingService.name}`);
    }
  }

  private async createClient(
    icreateClient: ICreateClient,
  ): Promise<mongoose.Types.ObjectId> {
    this.logger.debug(
      `::execute::createClient::parameters${JSON.stringify(icreateClient)}`,
    );
    try {
      const { firstName, lastName, dni, telephone } = icreateClient;
      const newClient = await this.clientModel.create({
        firstName,
        lastName,
        dni,
        telephone,
        status: GENERAL.CONSULTING.STATUS.CREATED,
      });
      return newClient._id;
    } catch (error) {
      this.logger.error(error);
      throw new RegisterClientInternalException();
    }
  }

  private async createConsulting(
    icreateConsulting: ICreateConsulting,
  ): Promise<string> {
    this.logger.debug(
      `::execute::createConsulting::parameters${JSON.stringify(
        icreateConsulting,
      )}`,
    );

    try {
      const { idClient, fullName, dni, reason, consultingDate, consultingNumber, email } =
        icreateConsulting;
      const newClient = await this.consultingModel.create({
        idClient,
        dni,
        fullName,
        email,
        reason,
        consultingNumber,
        consultingDate,
        status: GENERAL.CONSULTING.STATUS.CREATED,
      });
      return String(newClient._id);
    } catch (error) {
      this.logger.error(error);
      throw new RegisterConsultingInternalException();
    }
  }

  private async createAndUpdateSecuence(
    icreateSecuence: ICreateSecuence,
  ): Promise<string> {
    this.logger.debug(
      `::execute::createAndUpdateSecuence::parameters${JSON.stringify(
        icreateSecuence,
      )}`,
    );
    try {
      const { idSecuence, prefix, value, formatNumber } = icreateSecuence;
      const newInitValue = value + 1;
      const numberStr = newInitValue
        .toString()
        .padStart(formatNumber.length, '0');
      const secuence = `${prefix}-${
        formatNumber.slice(0, -numberStr.length) + numberStr
      }`;
      this.logger.debug(`::execute::createAndUpdateSecuence::secuence${secuence}`);
      await this.secuenceModel.findByIdAndUpdate(idSecuence, {
        $set: { initValue: newInitValue },
      });
      return secuence;
    } catch (error) {
      this.logger.error(error);
      throw new CreateAndUpdateSecuenceInternalException();
    }
  }

  private registerLogConsulting(
    icreateLogConsulting: ICreateLogConsulting,
  ): void {
    try {
      this.logsService.callConsultingRegister(icreateLogConsulting);
    } catch (error) {
      this.logger.error(error);
      throw new RegisterLogConsultingInternalException();
    }
  }

  private registerHomeConsulting(
    icreateHomeConsulting: ICreateHomeConsulting,
  ): void {
    try {
      this.homeService.callRegisterConsulting(icreateHomeConsulting);
    } catch (error) {
      this.logger.error(error);
      throw new RegisterHomeConsultingInternalException();
    }
  }

  private registerCalendarConsulting(
    icreateCalendarConsulting: ICreateCalendarConsulting
  ): void {
    try {
      this.userService.callCalendarRegister(icreateCalendarConsulting);
    } catch (error) {
      this.logger.error(error);
      throw new RegisterCalendarConsultingInternalException();
    }
  }

  private getLocalDateAndLocalTime(consultingDate: Date) {

    const formatConsultingDate = new Date(consultingDate);

    const day = formatConsultingDate.toLocaleString('es-ES', { day: 'numeric' });
    const month = formatConsultingDate.toLocaleString('es-ES', { month: 'numeric' });
    const year = formatConsultingDate.toLocaleString('es-ES', { year: 'numeric' });

    const formatDate: string = formatConsultingDate.toLocaleDateString(
      'es-ES',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      },
    );

    const formatHour: string = formatConsultingDate.toLocaleTimeString(
      'es-ES',
      {
        hour: '2-digit',
        minute: '2-digit',
      },
    );

    const [hours, minutes] = formatHour.split(":");

    formatConsultingDate.setHours(parseInt(hours, 10), parseInt(minutes, 10) + 50)
    const formatHourAdd =  formatConsultingDate.toLocaleTimeString(
      'es-ES',
      {
        hour: '2-digit',
        minute: '2-digit',
      },
    );

    return { formatDate, formatHour, formatHourAdd, day, month, year };
  }
}
