import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { ConfigModule } from '@config/config.module';
import { PrismaModule } from '@prisma/prisma.module';
import { UsersModule } from '@users/users.module';
import { JwtModule } from '@jwt/jwt.module';
import { AuthModule } from '@auth/auth.module';
import { PostsModule } from '@posts/posts.module';
import { CategoriesModule } from '@app/apis/categories/categories.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { FiltersModule } from './filters/filters.module';

@Module({
  imports: [
    ConfigModule, //
    PrismaModule,
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    AuthModule,
    FiltersModule,

    // apis
    UsersModule,
    PostsModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '/posts', method: RequestMethod.ALL });
  }
}
