import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const existingUser = await this.userModel.findOne({
        email: registerDto.email,
      });

      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(
        registerDto.password,
        10,
      );

      const user = await this.userModel.create({
        ...registerDto,
        password: hashedPassword,
      });

      return {
        success: true,
        message: 'User registered successfully',
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userModel.findOne({
        email: loginDto.email,
      });

      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new BadRequestException('Invalid credentials');
      }

      const payload = {
        sub: user._id,
        email: user.email,
        role: user.role,
      };

      const accessToken = await this.jwtService.signAsync(
        payload,
      );

      return {
        success: true,
        message: 'Login successful',
        data: {
          accessToken,
        },
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}