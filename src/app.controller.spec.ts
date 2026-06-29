import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;
  const mockConfig: Record<string, string | number> = {
    APP_NAME: 'Gym Management API',
    PORT: 3000,
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => mockConfig[key]),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return app config', () => {
      expect(appController.getConfig()).toEqual({
        appName: 'Gym Management API',
        port: 3000,
      });
    });
  });
});
