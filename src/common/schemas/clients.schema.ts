import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { SCHEMAS } from '../../const/schema.name.const';

export type ClientsDocument = Clients & mongoose.Document;

@Schema({ collection: SCHEMAS.CLIENTS, autoIndex: true })
export class Clients {
  @Prop({ required: true })
  firstName: string;

  @Prop({})
  lastName: string;

  @Prop({ required: true })
  dni: string;

  @Prop({})
  telephone: string;

  @Prop({ required: true })
  status: number;

  @Prop({ required: true, default: mongoose.now() })
  createdAt: Date;

  @Prop({})
  updatedAt: Date;
}

export const ClientsSchema = SchemaFactory.createForClass(Clients);
