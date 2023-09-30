import { IsNotEmpty, IsEmail } from 'class-validator';
export class AdminRegisterDto {

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

}
