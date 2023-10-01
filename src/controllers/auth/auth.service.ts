import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schema/auth/user.schema';
import { Model } from 'mongoose';
import { JwtPayload } from './jwt/jwt.payload';
import { JwtProvider } from './jwt/jwt.provider';
import { UserRole } from '../../config/guards/roles.enum';
import { AdminLoginDto } from './dto/admin.dto';
import { Admin, AdminDocument } from 'src/schema/auth/admin.schema';
import { AdminRegisterDto } from './dto/adminRegister.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    private readonly jwtProvider: JwtProvider,
  ) {}

  async validateUser(payload: JwtPayload) {
    const currentUser = await this.userModel
      .findOne({
        email: payload.email,
      })
      .select('-password');

    if (!currentUser) {
      throw new UnauthorizedException('Unauthorized user');
    }

    return currentUser;
  }

  async create(dto: RegisterDto) {
    const role = dto.role || UserRole.USER;

    const existUser = await this.userModel.findOne({ email: dto.email });
    if (existUser !== null) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = new this.userModel({
      ...dto,
      role: role,
      password: hashedPassword,
    });

    return await newUser.save();
  }

  async createAdmin(dto: AdminRegisterDto) {
    const existAdmin = await this.userModel.findOne({ email: dto.email });
    if (existAdmin !== null) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newAdmin = new this.userModel({
      ...dto,
      role: UserRole.ADMIN,
      password: hashedPassword,
    });

    return await newAdmin.save();
  }

  async login(dto: LoginDto) {
    try {
      const { email, password } = dto;
      const existUser = await this.userModel.findOne({ email });

      if (!existUser) {
        throw new ConflictException('Email not found');
      }

      const passwordMatch = await bcrypt.compare(password, existUser.password);

      if (!passwordMatch) {
        throw new ConflictException('Incorrect password');
      }

      const payload: JwtPayload = {
        name: existUser.firstName,
        email: existUser.email,
        _id: existUser._id,
        role: existUser.role,
      };

      const token = await this.jwtProvider.generateToken(payload);

      return {
        message: 'Login successful',
        token: token,
      };
    } catch (error) {
      console.error('Login error:', error);

      throw error;
    }
  }

  // admin login
  async adminLogin(dto: AdminLoginDto) {
    try {
      const existAdmin = await this.userModel.findOne({ email: dto.email });

      if (!existAdmin) {
        throw new ConflictException('Email not found');
      }

      const passwordMatch = await bcrypt.compare(
        dto.password,
        existAdmin.password,
      );

      if (!passwordMatch) {
        throw new ConflictException('Incorrect password');
      }

      const payload: JwtPayload = {
        name: existAdmin.firstName,
        email: existAdmin.email,
        _id: existAdmin._id,
        role: existAdmin.role,
      };

      const token = await this.jwtProvider.generateToken(payload);

      return {
        message: 'Admin login successful',
        token: token,
      };
    } catch (error) {
      console.error('Admin login error:', error);

      throw error;
    }
  }

  async findAll() {
    return await this.userModel.find().select('-password').exec();
  }

  async findOne(id: string) {
    return await this.userModel.findOne({ _id: id }).select('-password').exec();
  }
}
