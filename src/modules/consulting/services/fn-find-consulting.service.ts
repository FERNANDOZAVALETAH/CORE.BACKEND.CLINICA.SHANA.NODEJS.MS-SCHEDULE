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
import { ResponseGetConsultingDto, ResponseGetConsultingIdDto } from '../dto';
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

  async execute(
    ifindConsultingTypeValue: IFindConsultingTypeValue,
    idConsulting?: string,
  ): Promise<ResponseGenericDto> {
    this.logger.debug(
      `::execute::parameters::${JSON.stringify(ifindConsultingTypeValue)}`,
    );

    try {
      if (idConsulting != undefined || idConsulting != null) {
        return await this.findById(idConsulting);
      }

      const { type, value } = ifindConsultingTypeValue;
      let responseCreateConsulting: ConsultingsDocument = null;
      if (type == 'DNI') {
        responseCreateConsulting = await this.consultingModel.findOne({
          dni: value,
        });
      }

      if (type == 'CONSULTING_DATE') {
        responseCreateConsulting = await this.consultingModel.findOne({
          $or: [{}, {}],
        });
      }

      if (type == 'CONSULTING_NUMBER') {
        responseCreateConsulting = await this.consultingModel.findOne({
          consultingNumber: value,
        });
      }

      if (!responseCreateConsulting) {
        throw new ConsultingNotFoundException();
      }

      const client = await this.clientModel.findById(
        responseCreateConsulting.idClient,
      );

      return <ResponseGenericDto>{
        message: 'Processo exitoso',
        operation: `::${FnFindConsultingService.name}::execute`,
        data: <ResponseGetConsultingDto>{
          idConsulting: responseCreateConsulting._id,
          client: `${client.firstName} ${client.lastName}`,
          dni: responseCreateConsulting.dni,
          consultingNumber: responseCreateConsulting.consultingNumber,
        },
      };
    } catch (error) {
      this.logger.error(error);
      throw new ExecuteInternalException(`${FnFindConsultingService.name}`);
    }
  }

  private async findById(idConsulting): Promise<any> {
    const consulting = await this.consultingModel.findById(idConsulting);
    const client = await this.clientModel.findById(consulting.idClient);
    return <ResponseGenericDto>{
      message: 'Processo exitoso',
      operation: `::${FnFindConsultingService.name}::execute`,
      data: <ResponseGetConsultingIdDto>{
        idConsulting: consulting._id,
        client: `${client.firstName} ${client.lastName}`,
        dni: consulting.dni,
        consultingNumber: consulting.consultingNumber,
      },
    };
  }
}
