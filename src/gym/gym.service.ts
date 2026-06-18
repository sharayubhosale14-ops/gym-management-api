import { Injectable } from '@nestjs/common';

@Injectable()
export class GymService {
  private gyms = [
    {
      id: 1,
      name: 'Gold Gym',
      location: 'Mumbai',
    },
    {
      id: 2,
      name: 'Fitness Hub',
      location: 'Pune',
    },
  ];

  getAllGyms() {
    return this.gyms;
  }

  addGym(gym: any) {
    this.gyms.push(gym);
    return {
      message: 'Gym added successfully',
    };
  }

  searchGymByLocation(location: string) {
    return this.gyms.filter(
      (gym) => gym.location.toLowerCase() === location.toLowerCase(),
    );
  }

  getGymById(id: number) {
    return this.gyms.find((gym) => gym.id === id);
  }
}