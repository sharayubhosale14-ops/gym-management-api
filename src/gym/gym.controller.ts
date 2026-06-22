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
  getAllGyms() {
    return this.gymService.getAllGyms();
  }

  @Post()
  addGym(@Body() createGymDto: CreateGymDto) {
    return this.gymService.addGym(createGymDto);
  }

  @Get('search')
  searchGym(@Query('location') location: string) {
    return this.gymService.searchGymByLocation(location);
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