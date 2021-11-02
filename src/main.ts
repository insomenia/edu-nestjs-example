import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from '@app/app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const prismaService: PrismaService = app.get(PrismaService);
  const config = app.get(ConfigService);
  const logger = new Logger('bootstrap');

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(config.get('app.port'), () => {
    logger.log(
      `Server is listen on http://localhost:${config.get('app.port')}`,
    );
  });

  prismaService.enableShutdownHooks(app);
}
bootstrap();
