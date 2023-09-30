
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class AdminLoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
