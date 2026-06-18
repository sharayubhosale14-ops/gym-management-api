import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GymModule } from './gym/gym.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',

      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        APP_NAME: Joi.string().required(),
      }),
    }),

    GymModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}