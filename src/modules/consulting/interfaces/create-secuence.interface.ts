import * as mongoose from 'mongoose';

export interface ICreateSecuence {
  idSecuence: mongoose.Types.ObjectId;
  prefix: string;
  value: number;
  formatNumber: string;
}
