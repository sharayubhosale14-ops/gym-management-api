import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GymModule } from './gym/gym.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',

      validationSchema: Joi.object({
  PORT: Joi.number().required(),
  APP_NAME: Joi.string().required(),
  MONGO_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
}),
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),

    GymModule,

    AuthModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}