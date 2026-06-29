import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, Types } from 'mongoose';

import { CreateGymDto } from './dto/create-gym.dto';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { Gym } from './schemas/gym.schema';
import { Membership } from './schemas/membership.schema';
import { UpdateGymDto } from './dto/update-gym.dto';
import { UpdateManyGymDto } from './dto/update-many-gym.dto';
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

    const filter: QueryFilter<Gym> = {};

    if (location) {
      filter.location = {
        $regex: location,
        $options: 'i',
      };
    }

    const gyms = await this.gymModel
      .find(filter)
      .select('name location ownerId memberships createdAt updatedAt')
      .populate('ownerId', 'name email role')
      .populate('memberships', 'planName price status startDate endDate')
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .lean();

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
      ownerId: gym.ownerId ? (gym.ownerId as any) : undefined,
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
      .select('name location ownerId')
      .populate('ownerId', 'name email role')
      .lean();
  }

  async getGymById(id: string) {
    const gym = await this.gymModel
      .findById(id)
      .select('name location ownerId memberships createdAt updatedAt')
      .populate('ownerId', 'name email role')
      .populate({
        path: 'memberships',
        select: 'planName price status startDate endDate userId',
        populate: {
          path: 'userId',
          select: 'name email role',
        },
      })
      .lean();

    if (!gym) {
      throw new NotFoundException('Gym not found');
    }

    return gym;
  }

  async updateGym(id: string, gym: UpdateGymDto) {
    const gymData: Partial<Gym> = {
      ...gym,
      ownerId: gym.ownerId ? (gym.ownerId as any) : undefined,
    };

    const updatedGym = await this.gymModel
      .findOneAndUpdate({ _id: id }, gymData, {
        new: true,
      })
      .select('name location ownerId memberships createdAt updatedAt')
      .populate('ownerId', 'name email role')
      .populate('memberships', 'planName price status startDate endDate')
      .lean();

    if (!updatedGym) {
      throw new NotFoundException('Gym not found');
    }

    return {
      message: 'Gym updated successfully',
      data: updatedGym,
    };
  }

  async updateManyGyms(updateManyGymDto: UpdateManyGymDto) {
    const result = await this.gymModel.updateMany(
      {
        location: updateManyGymDto.oldLocation,
      },
      {
        $set: {
          location: updateManyGymDto.newLocation,
        },
      },
    );

    return {
      message: 'Gyms updated successfully',
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    };
  }

  async deleteManyGyms(location: string) {
    const result = await this.gymModel.deleteMany({
      location,
    });

    return {
      message: 'Gyms deleted successfully',
      deletedCount: result.deletedCount,
    };
  }

  async addMembership(gymId: string, membershipDto: CreateMembershipDto) {
    const gym = await this.gymModel.findById(gymId).select('_id').lean();

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
    const filter: QueryFilter<Gym> = location
      ? {
          location: {
            $regex: location,
            $options: 'i',
          },
        }
      : {};

    return this.gymModel
      .find(filter)
      .select('name location ownerId')
      .lean()
      .explain('executionStats');
  }

  async compareLeanPerformance(location?: string) {
    const filter = this.createLocationFilter(location);

    const hydrated = await this.measureQueryTime(() =>
      this.gymModel
        .find(filter)
        .select('name location ownerId')
        .limit(100)
        .exec(),
    );

    const lean = await this.measureQueryTime(() =>
      this.gymModel
        .find(filter)
        .select('name location ownerId')
        .limit(100)
        .lean()
        .exec(),
    );

    return {
      hydratedQuery: hydrated,
      leanQuery: lean,
      fasterByMs: Number(
        (hydrated.executionTimeMs - lean.executionTimeMs).toFixed(3),
      ),
    };
  }

  async getQueryExecutionTime(location?: string) {
    const filter = this.createLocationFilter(location);

    return this.measureQueryTime(() =>
      this.gymModel
        .find(filter)
        .select('name location ownerId memberships')
        .populate('ownerId', 'name email role')
        .limit(100)
        .lean()
        .exec(),
    );
  }

  async getAnalytics() {
    const [totalGyms, totalMembers] = await Promise.all([
      this.gymModel.countDocuments(),
      this.membershipModel.countDocuments(),
    ]);

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

  private createLocationFilter(location?: string): QueryFilter<Gym> {
    if (!location) {
      return {};
    }

    return {
      location: {
        $regex: location,
        $options: 'i',
      },
    };
  }

  private async measureQueryTime<T>(queryFactory: () => Promise<T[]>) {
    const startedAt = process.hrtime.bigint();
    const data = await queryFactory();
    const endedAt = process.hrtime.bigint();
    const executionTimeMs = Number(endedAt - startedAt) / 1_000_000;

    return {
      executionTimeMs: Number(executionTimeMs.toFixed(3)),
      resultCount: data.length,
      data,
    };
  }
}
