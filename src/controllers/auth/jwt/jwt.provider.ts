import { Injectable } from '@nestjs/common';
import { JwtPayload } from './jwt.payload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtProvider {
  constructor(private jwtService: JwtService) {}

  async generateToken(payload: JwtPayload) {
    const expiresIn = '24h';
    return this.jwtService.sign(payload, { expiresIn });
  }
}
