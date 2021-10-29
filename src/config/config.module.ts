import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import AppConfig from '@config/app.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',

      load: [
        //
        () => ({ app: AppConfig() }),
      ],
    }),
  ],
})
export class ConfigModule {}
