import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from 'src/schema/auth/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtProvider } from './jwt/jwt.provider';
import { JwtStrategy } from './jwt/jwt.strategy';
import { Admin, AdminSchema } from 'src/schema/auth/admin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtProvider, JwtStrategy],
})
export class AuthModule {}
