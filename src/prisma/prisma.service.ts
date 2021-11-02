import {
  INestApplication,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
    this.$use(async (params, next) => {
      if (params.model === 'User' && params.action === 'create') {
        if (params.args.data['password']) {
          try {
            params.args.data['password'] = await bcrypt.hash(
              params.args.data['password'],
              10,
            );
          } catch (e) {
            console.error(e);
            throw new InternalServerErrorException();
          }
        }
      }
      const result = await next(params);
      return result;
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
