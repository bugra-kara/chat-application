import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsString()
  full_name: string;

  @IsString()
  username: string;
}

export class SignInDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
