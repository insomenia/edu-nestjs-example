import { Module } from '@nestjs/common';

import { ConfigModule } from '@config/config.module';
import { PrismaModule } from '@prisma/prisma.module';
import { UsersModule } from '@users/users.module';
import { JwtModule } from '@jwt/jwt.module';

@Module({
  imports: [
    ConfigModule, //
    PrismaModule,
    UsersModule,
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
