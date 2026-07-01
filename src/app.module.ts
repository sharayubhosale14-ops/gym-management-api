import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GymModule } from './gym/gym.module';
import { AuthModule } from './auth/auth.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
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

    ThrottlerModule.forRoot({
  throttlers: [
    {
      ttl: 60000,
      limit: 10,
    },
  ],
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
  providers: [
  {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },

  AppService,

  {
    provide: APP_INTERCEPTOR,
    useClass: ResponseInterceptor,
  },

  {
    provide: APP_FILTER,
    useClass: GlobalExceptionFilter,
  },
],
})
export class AppModule {}
