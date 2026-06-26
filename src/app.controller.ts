import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getConfig() {
    return {
      appName: this.configService.get<string>('APP_NAME'),
      port: this.configService.get<number>('PORT'),
    };
  }
}
