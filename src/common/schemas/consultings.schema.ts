import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { SCHEMAS } from '../../const/schema.name.const';

export type ConsultingsDocument = Consultings & mongoose.Document;

@Schema({ collection: SCHEMAS.CONSULTINGS, autoIndex: true })
export class Consultings {
  @Prop({ required: true })
  idClient: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  dni: string;

  @Prop({ required: true, unique: true })
  consultingNumber: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ required: true })
  consultingDate: Date;

  @Prop({ required: true })
  status: number;

  @Prop({ required: true, default: mongoose.now() })
  createdAt: Date;

  @Prop({})
  updatedAt: Date;

  @Prop(
    raw([
      {
        idSession: mongoose.Schema.Types.ObjectId,
        sessionNumber: Number,
        sessionDate: String,
        sessionHour: String,
        scheduleDate: Date,
        status: Number,
      },
    ]),
  )
  sessions: Record<string, any>[];
}

export const ConsultingsSchema = SchemaFactory.createForClass(Consultings);
