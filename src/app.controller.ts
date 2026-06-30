import { BadRequestException, Controller, Get } from '@nestjs/common';
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

  @Get('debug/interceptor-flow')
  getInterceptorFlow() {
    return {
      message: 'Response interceptor executed successfully',
      data: {
        step: 'controller -> interceptor -> formatted response',
      },
    };
  }

  @Get('debug/global-exception')
  getGlobalException() {
    throw new BadRequestException('Global exception filter executed successfully');
  }
}
