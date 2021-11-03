import { Injectable } from '@nestjs/common';

import { PrismaService } from '@prisma/prisma.service';
import { SignupInput, SignupOutput } from '@users/dtos/signup.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async signup({
    email,
    username,
    bio,
    password,
    verifyPassword,
    avatar,
  }: SignupInput): Promise<SignupOutput> {
    try {
      const existedEmail = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (existedEmail) {
        return { ok: false, error: '계정이 있는 이메일입니다.' };
      }

      if (password !== verifyPassword) {
        return {
          ok: false,
          error: '비밀번호가 같지 않습니다.',
        };
      }

      const passwordRegex = new RegExp(
        /(?=.*[!@#$%^&\*\(\)_\+\-=\[\]\{\};\':\"\\\|,\.<>\/\?]+)(?=.*[a-zA-Z]+)(?=.*\d+)/,
      );

      const passwordTestPass = passwordRegex.test(password);

      if (!passwordTestPass) {
        return {
          ok: false,
          error: '비밀번호는 문자, 숫자, 특수문자를 1개 이상 포함해야 합니다.',
        };
      }

      await this.prisma.user.create({
        data: {
          email,
          username,
          password,
          bio,
          avatar,
        },
      });

      return { ok: true };
    } catch (e) {
      return { ok: false, error: '계정을 생성할 수 없습니다.' };
    }
  }
}
