import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ResponseGenericDto } from 'src/common/dto';
import {
  Clients,
  ClientsDocument,
  Consultings,
  ConsultingsDocument,
} from 'src/common/schemas';
import { RequestGetConsultingDto, ResponseGetConsultingDto, ResponseGetConsultingIdDto } from '../dto';
import { IFindConsultingTypeValue } from '../interfaces';
import {
  ConsultingNotFoundException,
  ExecuteInternalException,
} from 'src/exception';

@Injectable()
export class FnFindConsultingService {
  private logger = new Logger(`::${FnFindConsultingService.name}::`);

  constructor(
    @InjectModel(Consultings.name)
    private readonly consultingModel: mongoose.Model<ConsultingsDocument>,
    @InjectModel(Clients.name)
    private readonly clientModel: mongoose.Model<ClientsDocument>,
  ) {}


  async execute(query: RequestGetConsultingDto, idConsulting: string): Promise<any> {
    this.logger.debug(
      `::execute::findAll::parameters::${JSON.stringify(query)}`,
    );

    try {

      let filter : any = {};

      if(idConsulting) {
        return await this.findById(idConsulting);
      }

      if(query.status != 'ALL') {
        filter.status = parseInt(query.status)
      }

      if(query.docNumber) {
        filter.$or = [{
          consultingNumber: query.docNumber
        }, {
          dni: query.docNumber
        }]
      }

      if(query.email) {
        filter.email = query.email
      }

      if(query.startDate && query.endDate) {
        filter.consultingDate = {
          $gte: new Date(query.startDate),
          $lte: new Date(query.endDate),
        }
      }
      this.logger.debug(
        `::execute::findAll::filter::${JSON.stringify(filter)}`,
      );
      const consultings = await this.consultingModel.find(filter);
      let responseGetConsultings: ResponseGetConsultingDto[] = [];
      for (const consulting of consultings) {
        const { formatDate, formatHour } =
        this.getLocalDateAndLocalTime(consulting.consultingDate);

        responseGetConsultings.push({
          client: consulting.fullName,
          idConsulting: consulting._id,
          dni: consulting.dni,
          consultingNumber: consulting.consultingNumber,
          consultingDate:  `${formatDate} ${formatHour}`,
          status: consulting.status,
          reason: consulting.reason
        })
      }

      return <ResponseGenericDto>{
        message: 'PE: Proceso exitoso',
        operation: `::${FnFindConsultingService.name}::execute`,
        data: responseGetConsultings,
      };

    } catch (error) {
      this.logger.error(error);
      throw new ExecuteInternalException(`${FnFindConsultingService.name}`);
    }
  }

  private async findById(idConsulting): Promise<any> {
    this.logger.debug(
      `::execute::findById::parameters::${JSON.stringify(idConsulting)}`,
    );
    const consulting = await this.consultingModel.findById(idConsulting);
    const client = await this.clientModel.findById(consulting.idClient);

    const { formatDate, formatHour } =
    this.getLocalDateAndLocalTime(consulting.consultingDate);

    return <ResponseGenericDto>{
      message: 'PE: Proceso exitoso',
      operation: `::${FnFindConsultingService.name}::execute`,
      data: <ResponseGetConsultingIdDto>{
        idConsulting: consulting._id,
        client: consulting.fullName,
        email: consulting.email,
        dni: consulting.dni,
        consultingNumber: consulting.consultingNumber,
        reason: consulting.reason,
        formatDate,
        formatHour
      },
    };
  }

  private getLocalDateAndLocalTime(consultingDate: Date) {
    const formatDate: string = new Date(consultingDate).toLocaleDateString(
      'es-ES',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      },
    );

    const formatHour: string = new Date(consultingDate).toLocaleTimeString(
      'es-ES',
      {
        hour: '2-digit',
        minute: '2-digit',
      },
    );

    return { formatDate, formatHour };
  }
}
