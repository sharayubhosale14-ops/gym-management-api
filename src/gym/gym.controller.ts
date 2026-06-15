import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GymService } from './gym.service';

@Controller('gym')
export class GymController {
  constructor(private readonly gymService: GymService) {}

  @Get()
  getAllGyms() {
    return this.gymService.getAllGyms();
  }

  @Post()
  addGym(@Body() gym: any) {
    console.log('Request Body:', gym);
    return this.gymService.addGym(gym);
  }

  @Get(':id')
  getGymById(@Param('id') id: string) {
    console.log('Route Param:', id);
    return this.gymService.getGymById(Number(id));
  }
}