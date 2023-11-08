import * as mongoose from 'mongoose';

export interface ICreateConsulting {
  idClient: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  dni: string;
  reason: string;
  consultingDate: Date;
  consultingNumber: string;
}
