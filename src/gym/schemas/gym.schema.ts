import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GymDocument = HydratedDocument<Gym>;

@Schema({
  timestamps: true,
})
export class Gym {
  @Prop({
    required: true,
  })
  name!: string;

  @Prop({
  required: true,
  index: true,
})
location!: string;

  @Prop({
    required: true,
  })
  trainer!: string;

  @Prop({
    required: true,
  })
  members!: number;
}

export const GymSchema =
  SchemaFactory.createForClass(Gym);