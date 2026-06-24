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

  async getAllGyms(
  page = 1,
  limit = 10,
  location?: string,
  sortBy = 'createdAt',
  order = 'desc',
) {
  const skip = (page - 1) * limit;

  const filter: any = {};

  if (location) {
    filter.location = {
      $regex: location,
      $options: 'i',
    };
  }

  const gyms = await this.gymModel
    .find(filter)
    .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(limit);

  const total = await this.gymModel.countDocuments(filter);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data: gyms,
  };
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
  async getAnalytics() {
  const gyms = await this.gymModel.find();

  const totalGyms = gyms.length;

  const totalMembers = gyms.reduce(
    (sum, gym) => sum + gym.members,
    0,
  );

  const averageMembers =
    totalGyms === 0
      ? 0
      : Math.round(totalMembers / totalGyms);

  return {
    totalGyms,
    totalMembers,
    averageMembers,
  };
}
  async deleteGym(id: string) {
    return this.gymModel.findByIdAndDelete(id);
  }
}