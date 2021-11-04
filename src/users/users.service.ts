import { User } from '.prisma/client';
import { AuthService } from '@app/auth/auth.service';
import { JwtService } from '@app/jwt/jwt.service';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@prisma/prisma.service';
import { SignupInput, SignupOutput } from '@users/dtos/signup.dto';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
} from './dtos/change-password.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
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

  async editProfile(
    editProfileInput: EditProfileInput,
    authUser: User,
  ): Promise<EditProfileOutput> {
    try {
      await this.prisma.user.findUnique({
        where: {
          id: authUser.id,
        },
      });

      if (editProfileInput.email) {
        if (editProfileInput.email !== authUser.email) {
          const exists = await this.prisma.user.findUnique({
            where: {
              email: editProfileInput.email,
            },
          });
          if (exists) {
            return {
              ok: false,
              error: '이미 존재하는 이메일로 수정할 수 없습니다.',
            };
          }
        }
      }

      if (editProfileInput.username) {
        if (editProfileInput.username !== authUser.username) {
          const exists = await this.prisma.user.findUnique({
            where: {
              username: editProfileInput.username,
            },
          });
          if (exists) {
            return {
              ok: false,
              error: '이미 존재하는 사용자 이름으로 수정할 수 없습니다.',
            };
          }
        }
      }

      await this.prisma.user.update({
        where: {
          id: authUser.id,
        },
        data: {
          ...editProfileInput,
        },
      });

      return {
        ok: true,
      };
    } catch (e) {
      console.error(e);
      return {
        ok: false,
        error: '사용자 프로파일을 수정할 수 없습니다.',
      };
    }
  }

  async changePassword(
    { currentPassword, newPassword, verifyPassword }: ChangePasswordInput,
    user: User,
  ): Promise<ChangePasswordOutput> {
    try {
      if (newPassword !== verifyPassword) {
        return {
          ok: false,
          error: '비밀번호가 같지 않습니다.',
        };
      }

      const passwordCorrect = await this.authService.checkPassowrd(
        user,
        currentPassword,
      );
      if (!passwordCorrect) {
        return {
          ok: false,
          error: '현재 비밀번호가 틀립니다.',
        };
      }

      if (currentPassword === newPassword) {
        return {
          ok: false,
          error: '새 비밀번호가 현재 비밀번호와 같습니다.',
        };
      }

      const regex = new RegExp(
        /(?=.*[!@#$%^&\*\(\)_\+\-=\[\]\{\};\':\"\\\|,\.<>\/\?]+)(?=.*[a-zA-Z]+)(?=.*\d+)/,
      );

      const passwordTestPass = regex.test(newPassword);

      if (!passwordTestPass) {
        return {
          ok: false,
          error: '비밀번호는 문자, 숫자, 특수문자를 1개 이상 포함해야 합니다.',
        };
      }

      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: newPassword,
        },
      });

      return {
        ok: true,
      };
    } catch (e) {
      console.error(e);
      return {
        ok: false,
        error: '사용자 프로파일 수정할 수 없습니다.',
      };
    }
  }
}
