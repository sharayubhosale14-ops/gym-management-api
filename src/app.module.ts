import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GymModule } from './gym/gym.module';

@Module({
  imports: [GymModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
