import { IsNotEmpty, IsEmail, IsIn } from 'class-validator';
export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsIn(['user', 'admin'])
  role: string;
}
