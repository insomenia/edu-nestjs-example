import { Module } from '@nestjs/common';

import { ConfigModule } from '@config/config.module';
import { PrismaModule } from '@prisma/prisma.module';
import { UsersModule } from '@users/users.module';
import { JwtModule } from '@jwt/jwt.module';
import { AuthModule } from '@auth/auth.module';
import { PostsModule } from '@posts/posts.module';
import { CategoriesModule } from '@app/apis/categories/categories.module';

@Module({
  imports: [
    ConfigModule, //
    PrismaModule,
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
