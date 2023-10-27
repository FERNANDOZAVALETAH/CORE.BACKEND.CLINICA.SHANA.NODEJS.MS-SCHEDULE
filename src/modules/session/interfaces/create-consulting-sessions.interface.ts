import * as mongoose from 'mongoose';

export interface ICreateConsultingSession {
  idSession: mongoose.Types.ObjectId;
  sessionNumber: string;
  sessionDate: string;
  sessionHour: string;
  scheduleDate: Date;
  status: number;
}
