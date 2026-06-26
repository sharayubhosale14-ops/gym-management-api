import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GymController } from './gym.controller';
import { GymService } from './gym.service';
import { GymGateway } from './gym.gateway';
import { Gym, GymSchema } from './schemas/gym.schema';
import { Membership, MembershipSchema } from './schemas/membership.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Gym.name,
        schema: GymSchema,
      },
      {
        name: Membership.name,
        schema: MembershipSchema,
      },
    ]),
  ],
  controllers: [GymController],
  providers: [GymService, GymGateway],
})
export class GymModule {}
