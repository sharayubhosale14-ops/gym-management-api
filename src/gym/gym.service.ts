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

  getGymById(id: number) {
    return this.gyms.find((gym) => gym.id === id);
  }
}