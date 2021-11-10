import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { AuthService } from '@app/auth/auth.service';
import { JwtService } from '@app/jwt/jwt.service';
import { PrismaService } from '@prisma/prisma.service';
import { SignupInput, SignupOutput } from '@users/dtos/signup.dto';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
} from '@users/dtos/change-password.dto';
import {
  EditProfileInput,
  EditProfileOutput,
} from '@users/dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from '@users/dtos/login.dto';
import { UserProfileOutput } from '@users/dtos/user-profile.dto';

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
    const existedEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existedEmail) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Eamil already exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (password !== verifyPassword) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Password doesn'match",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordRegex = new RegExp(
      /(?=.*[!@#$%^&\*\(\)_\+\-=\[\]\{\};\':\"\\\|,\.<>\/\?]+)(?=.*[a-zA-Z]+)(?=.*\d+)/,
    );

    const passwordTestPass = passwordRegex.test(password);

    if (!passwordTestPass) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error:
            'Password must include at least one letter, number and special character',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
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
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Can't create account",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    let user: User;
    try {
      user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
    } catch (e) {
      return { ok: false, error: '로그인을 할 수 없습니다.' };
    }

    if (!user) {
      throw new HttpException(
        {
          staus: HttpStatus.BAD_REQUEST,
          error: "User doesn't exist",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordCorrect = await this.authService.checkPassowrd(
      user,
      password,
    );

    if (!passwordCorrect) {
      throw new HttpException(
        {
          staus: HttpStatus.BAD_REQUEST,
          error: 'Password was wrong',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = this.jwtService.sign(user.id.toString());

    return { ok: true, token };
  }

  async findUserById(id: number): Promise<UserProfileOutput> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!!!user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      ok: true,
      user,
    };
  }

  async editProfile(
    editProfileInput: EditProfileInput,
    authUser: User,
  ): Promise<EditProfileOutput> {
    let exists;
    if (editProfileInput?.email !== authUser.email) {
      try {
        exists = await this.prisma.user.findUnique({
          where: {
            email: editProfileInput.email,
          },
        });
      } catch (error) {
        console.error(error);
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: "Can't modify the user account",
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (exists) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Can't modify the user account by already existed email",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (editProfileInput?.username !== authUser.username) {
      try {
        exists = await this.prisma.user.findUnique({
          where: {
            username: editProfileInput.username,
          },
        });
      } catch (error) {
        console.error(error);
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: "Can't modify the user account",
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (exists) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: "Can't modify the user account by already existed username",
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    try {
      await this.prisma.user.update({
        where: {
          id: authUser.id,
        },
        data: {
          ...editProfileInput,
        },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Can't modify the user account",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      ok: true,
    };
  }

  async changePassword(
    { currentPassword, newPassword, verifyPassword }: ChangePasswordInput,
    user: User,
  ): Promise<ChangePasswordOutput> {
    if (newPassword !== verifyPassword) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Password doesn't match",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordCorrect = await this.authService.checkPassowrd(
      user,
      currentPassword,
    );
    if (!passwordCorrect) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Current password is wrong',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (currentPassword === newPassword) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'New password is same current password',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const regex = new RegExp(
      /(?=.*[!@#$%^&\*\(\)_\+\-=\[\]\{\};\':\"\\\|,\.<>\/\?]+)(?=.*[a-zA-Z]+)(?=.*\d+)/,
    );

    const passwordTestPass = regex.test(newPassword);

    if (!passwordTestPass) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error:
            'Password must include at least one letter, number and special character',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
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
