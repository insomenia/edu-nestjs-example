import { Module } from '@nestjs/common';

import { ConfigModule } from '@config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule, PrismaModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
