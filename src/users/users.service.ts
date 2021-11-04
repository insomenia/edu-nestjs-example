import { AuthService } from '@app/auth/auth.service';
import { JwtService } from '@app/jwt/jwt.service';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@prisma/prisma.service';
import { SignupInput, SignupOutput } from '@users/dtos/signup.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UserProfileOutput } from './dtos/user-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

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

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return {
          ok: false,
          error: '사용자를 찾을 수 없습니다.',
        };
      }

      const passwordCorrect = await this.authService.checkPassowrd(
        user,
        password,
      );
      if (!passwordCorrect) {
        return {
          ok: false,
          error: '비밀번호가 틀렸습니다.',
        };
      }

      const token = this.jwtService.sign(user.id.toString());

      return { ok: true, token };
    } catch (e) {
      return { ok: false, error: '로그인을 할 수 없습니다.' };
    }
  }

  async findUserById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (!!!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      return {
        ok: true,
        user,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'User not found',
      };
    }
  }
}
