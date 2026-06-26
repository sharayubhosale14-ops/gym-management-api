import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Schema as MongooseSchema,
  HydratedDocument,
  Types,
} from 'mongoose';

export type MembershipDocument = HydratedDocument<Membership>;

@Schema({
  timestamps: true,
})
export class Membership {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Gym',
    required: true,
    index: true,
  })
  gymId!: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true,
  })
  userId?: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
  })
  planName!: string;

  @Prop({
    required: true,
    min: 0,
  })
  price!: number;

  @Prop({
    enum: ['active', 'expired', 'cancelled'],
    default: 'active',
    index: true,
  })
  status!: string;

  @Prop({
    default: Date.now,
  })
  startDate!: Date;

  @Prop()
  endDate?: Date;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);

MembershipSchema.index({ gymId: 1, status: 1 });
MembershipSchema.index({ userId: 1, status: 1 });
