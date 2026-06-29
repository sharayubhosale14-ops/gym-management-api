import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument, Types } from 'mongoose';

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
  })
  location!: string;

  // owner of gym (admin/user who created it)
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    index: true,
  })
  ownerId?: Types.ObjectId;

  // list of memberships
  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Membership',
    default: [],
  })
  memberships!: Types.ObjectId[];
}

export const GymSchema = SchemaFactory.createForClass(Gym);

// 🚀 INDEXING (IMPORTANT FOR PERFORMANCE)
GymSchema.index({ location: 1 });
GymSchema.index({ name: 1 });
GymSchema.index({ location: 1, name: 1 });
