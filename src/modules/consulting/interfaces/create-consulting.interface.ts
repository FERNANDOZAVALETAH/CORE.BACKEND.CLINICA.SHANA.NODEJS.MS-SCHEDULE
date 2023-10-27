import * as mongoose from 'mongoose';

export interface ICreateConsulting {
  idClient: mongoose.Types.ObjectId;
  dni: string;
  reason: string;
  consultingDate: Date;
  consultingNumber: string;
}
