import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Gym, GymDocument } from './schemas/gym.schema';

@Injectable()
export class GymService {
  constructor(
    @InjectModel(Gym.name)
    private gymModel: Model<GymDocument>,
  ) {}

  async getAllGyms() {
    return this.gymModel.find();
  }

  async addGym(gym: any) {
    const newGym = await this.gymModel.create(gym);

    return {
      message: 'Gym added successfully',
      data: newGym,
    };
  }

  async searchGymByLocation(location: string) {
    return this.gymModel.find({
      location: {
        $regex: location,
        $options: 'i',
      },
    });
  }

  async getGymById(id: string) {
    return this.gymModel.findById(id);
  }

  async updateGym(id: string, gym: any) {
    return this.gymModel.findByIdAndUpdate(
      id,
      gym,
      { new: true },
    );
  }

  async deleteGym(id: string) {
    return this.gymModel.findByIdAndDelete(id);
  }
}