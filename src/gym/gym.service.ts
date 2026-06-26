import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateGymDto } from './dto/create-gym.dto';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { Gym } from './schemas/gym.schema';
import { Membership } from './schemas/membership.schema';

@Injectable()
export class GymService {
  constructor(
    @InjectModel(Gym.name)
    private readonly gymModel: Model<Gym>,
    @InjectModel(Membership.name)
    private readonly membershipModel: Model<Membership>,
  ) {}

  async getAllGyms(
    page = 1,
    limit = 10,
    location?: string,
    sortBy = 'createdAt',
    order = 'desc',
  ) {
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (location) {
      filter.location = {
        $regex: location,
        $options: 'i',
      };
    }

    const gyms = await this.gymModel
      .find(filter)
      .populate('ownerId', 'name email role')
      .populate('memberships')
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

  async addGym(gym: CreateGymDto) {
    const gymData: Partial<Gym> = {
      ...gym,
     ownerId: gym.ownerId ? gym.ownerId as any : undefined,
    };

    const newGym = new this.gymModel(gymData);

    await newGym.save();

    return {
      message: 'Gym added successfully',
      data: newGym,
    };
  }

  async searchGymByLocation(location: string) {
    return this.gymModel
      .find({
        location: {
          $regex: location,
          $options: 'i',
        },
      })
      .populate('ownerId', 'name email role');
  }

  async getGymById(id: string) {
    const gym = await this.gymModel
      .findById(id)
      .populate('ownerId', 'name email role')
      .populate({
        path: 'memberships',
        populate: {
          path: 'userId',
          select: 'name email role',
        },
      });

    if (!gym) {
      throw new NotFoundException('Gym not found');
    }

    return gym;
  }

  async updateGym(id: string, gym: Partial<CreateGymDto>) {
    const gymData: Partial<Gym> = {
      ...gym,
     ownerId: gym.ownerId ? (gym.ownerId as any) : undefined,
    };

    return this.gymModel
      .findByIdAndUpdate(id, gymData, { new: true })
      .populate('ownerId', 'name email role')
      .populate('memberships');
  }

  async addMembership(gymId: string, membershipDto: CreateMembershipDto) {
    const gym = await this.gymModel.findById(gymId);

    if (!gym) {
      throw new NotFoundException('Gym not found');
    }

    const membershipData: Partial<Membership> = {
      ...membershipDto,
      gymId: new Types.ObjectId(gymId),
      userId: membershipDto.userId
        ? new Types.ObjectId(membershipDto.userId)
        : undefined,
      startDate: membershipDto.startDate
        ? new Date(membershipDto.startDate)
        : undefined,
      endDate: membershipDto.endDate
        ? new Date(membershipDto.endDate)
        : undefined,
    };

    const membership = new this.membershipModel(membershipData);

    await membership.save();

    await this.gymModel.findByIdAndUpdate(gymId, {
      $addToSet: {
        memberships: membership._id,
      },
    });

    return {
      message: 'Membership added successfully',
      data: membership,
    };
  }

  async getRelationshipData(id: string) {
    return this.getGymById(id);
  }

  async getQueryPerformance(location?: string) {
    const filter = location
      ? {
          location: {
            $regex: location,
            $options: 'i',
          },
        }
      : {};

    return this.gymModel.find(filter).explain('executionStats');
  }

  async getAnalytics() {
    const gyms = await this.gymModel.find().populate('memberships');

    const totalGyms = gyms.length;

    const totalMembers = gyms.reduce(
      (sum, gym) => sum + (gym.memberships?.length || 0),
      0,
    );

    const averageMembers =
      totalGyms === 0 ? 0 : Math.round(totalMembers / totalGyms);

    return {
      totalGyms,
      totalMembers,
      averageMembers,
    };
  }

  async deleteGym(id: string) {
    const deletedGym = await this.gymModel.findByIdAndDelete(id);

    if (deletedGym) {
      await this.membershipModel.deleteMany({
        gymId: deletedGym._id,
      });
    }

    return deletedGym;
  }
}
