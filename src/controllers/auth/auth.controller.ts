import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/config/guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { AdminLoginDto } from './dto/admin.dto';
import { AdminRegisterDto } from './dto/adminRegister.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post('register')
  async create(@Body() dto: RegisterDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    return this.authService.create(dto);
  }

  @UsePipes(ValidationPipe)
  @Post('admin-register')
  async createAdmin(@Body() dto: AdminRegisterDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    return this.authService.createAdmin(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @Post('admin-login')
  async adminLogin(@Body() dto: AdminLoginDto) {
    return await this.authService.adminLogin(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('jwt');
    res.status(200).send('Logged out successfully');
  }

  @Get('all-users')
  findAll() {
    return this.authService.findAll();
  }

  @Get('user/:id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

 

}
