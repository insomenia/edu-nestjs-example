import { DynamicModule, Module } from '@nestjs/common';

import { CONFIG_OPTIONS } from '@app/common/common.constants';
import { JwtModuleOptions } from '@jwt/jwt';
import { JwtService } from '@jwt/jwt.service';

@Module({})
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      providers: [
        JwtService,
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
      ],
      exports: [JwtService],
    };
  }
}
