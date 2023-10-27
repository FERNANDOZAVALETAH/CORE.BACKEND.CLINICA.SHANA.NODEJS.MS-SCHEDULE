import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { SCHEMAS } from '../../const/schema.name.const';

export type SecuencesDocument = Secuences & mongoose.Document;

@Schema({ collection: SCHEMAS.SECUENCES, autoIndex: true })
export class Secuences {
  @Prop({ required: true })
  processCode: string;

  @Prop({ required: true })
  rol: string;

  @Prop({ required: true })
  prefix: string;

  @Prop({ required: true })
  initValue: number;

  @Prop({ required: true })
  formatNumber: string;

  @Prop({ required: true })
  status: number;

  @Prop({ required: true, default: mongoose.now() })
  createdAt: Date;

  @Prop({})
  updatedAt: Date;
}

export const SecuencesSchema = SchemaFactory.createForClass(Secuences);
