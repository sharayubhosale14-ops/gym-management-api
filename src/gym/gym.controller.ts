import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { GymService } from './gym.service';
import { CreateGymDto } from './dto/create-gym.dto';

@Controller('gym')
export class GymController {
  constructor(private readonly gymService: GymService) {}

  @Get()
  getAllGyms() {
    return this.gymService.getAllGyms();
  }

  @Post()
  addGym(@Body() createGymDto: CreateGymDto) {
    console.log('Request Body:', createGymDto);
    return this.gymService.addGym(createGymDto);
  }

  @Get('search')
  searchGym(@Query('location') location: string) {
    console.log('Query Param:', location);
    return this.gymService.searchGymByLocation(location);
  }

  @Get(':id')
  getGymById(@Param('id') id: string) {
    console.log('Route Param:', id);
    return this.gymService.getGymById(Number(id));
  }
}