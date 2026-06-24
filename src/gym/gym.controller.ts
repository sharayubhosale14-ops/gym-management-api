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

  @Get('search')
  searchGym(@Query('location') location: string) {
    return this.gymService.searchGymByLocation(location);
  }
  @Get('analytics')
getAnalytics() {
  return this.gymService.getAnalytics();
}
  @Get(':id')
  getGymById(@Param('id') id: string) {
    return this.gymService.getGymById(id);
  }

  @Patch(':id')
  updateGym(
    @Param('id') id: string,
    @Body() updateGymDto: any,
  ) {
    return this.gymService.updateGym(
      id,
      updateGymDto,
    );
  }

  @Delete(':id')
  deleteGym(@Param('id') id: string) {
    return this.gymService.deleteGym(id);
  }
}