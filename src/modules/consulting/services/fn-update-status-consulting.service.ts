import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ResponseGenericDto } from 'src/common/dto';
import { Consultings, ConsultingsDocument } from 'src/common/schemas';
import { ExecuteInternalException } from 'src/exception';
import { ResponseUpdateStatusConsultingDto } from '../dto/response-update-status-consulting.dto';

@Injectable()
export class FnUpdateStatusConsultingService {
  private logger = new Logger(`::${FnUpdateStatusConsultingService.name}::`);

  constructor(
    @InjectModel(Consultings.name)
    private readonly consultingModel: mongoose.Model<ConsultingsDocument>,
  ) {}

  async execute(idConsulting: string, status: number) {
    try {
      await this.consultingModel.findByIdAndUpdate(idConsulting, {
        $set: { status },
      });

      return <ResponseGenericDto>{
        message: 'PE: Proceso exitoso',
        operation: `::${FnUpdateStatusConsultingService.name}::execute`,
        data: <ResponseUpdateStatusConsultingDto>{
          idConsulting,
        },
      };
    } catch (error) {
      this.logger.error(error);
      throw new ExecuteInternalException(
        `${FnUpdateStatusConsultingService.name}`,
      );
    }
  }
}
