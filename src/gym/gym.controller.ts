import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';

import { GymService } from './gym.service';
import { CreateGymDto } from './dto/create-gym.dto';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { UpdateManyGymDto } from './dto/update-many-gym.dto';
@Controller('gym')
export class GymController {
  constructor(private readonly gymService: GymService) {}

  @Get()
  getAllGyms(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('location') location?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: string,
  ) {
    return this.gymService.getAllGyms(
      Number(page) || 1,
      Number(limit) || 10,
      location,
      sortBy,
      order,
    );
  }

  @Post()
  addGym(@Body() createGymDto: CreateGymDto) {
    return this.gymService.addGym(createGymDto);
  }

  @Post(':id/memberships')
  addMembership(
    @Param('id') id: string,
    @Body() createMembershipDto: CreateMembershipDto,
  ) {
    return this.gymService.addMembership(id, createMembershipDto);
  }

  @Get('search')
  searchGym(@Query('location') location: string) {
    return this.gymService.searchGymByLocation(location);
  }
  @Get('analytics')
  getAnalytics() {
    return this.gymService.getAnalytics();
  }

  @Get('debug/performance')
  getQueryPerformance(@Query('location') location?: string) {
    return this.gymService.getQueryPerformance(location);
  }

  @Get('debug/lean-comparison')
  compareLeanPerformance(@Query('location') location?: string) {
    return this.gymService.compareLeanPerformance(location);
  }

  @Get('debug/execution-time')
  getQueryExecutionTime(@Query('location') location?: string) {
    return this.gymService.getQueryExecutionTime(location);
  }

  @Get(':id/relationships')
  getRelationshipData(@Param('id') id: string) {
    return this.gymService.getRelationshipData(id);
  }

  @Get(':id')
  getGymById(@Param('id') id: string) {
    return this.gymService.getGymById(id);
  }

  @Patch('update/location')
  updateManyGyms(@Body() updateManyGymDto: UpdateManyGymDto) {
    return this.gymService.updateManyGyms(updateManyGymDto);
  }

  @Patch(':id')
  updateGym(@Param('id') id: string, @Body() updateGymDto: UpdateGymDto) {
    return this.gymService.updateGym(id, updateGymDto);
  }
  @Delete('delete/location')
  deleteManyGyms(@Query('location') location: string) {
    return this.gymService.deleteManyGyms(location);
  }

  @Delete(':id')
  deleteGym(@Param('id') id: string) {
    return this.gymService.deleteGym(id);
  }
}
