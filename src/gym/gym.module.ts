import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GymController } from './gym.controller';
import { GymService } from './gym.service';

import { Gym, GymSchema } from './schemas/gym.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Gym.name,
        schema: GymSchema,
      },
    ]),
  ],
  controllers: [GymController],
  providers: [GymService],
})
export class GymModule {}