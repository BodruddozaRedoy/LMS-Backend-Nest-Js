import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail() email: string;
  @IsNotEmpty() @MinLength(6) password: string;
  @IsString() firstName: string;
  @IsString() lastName: string;
}

export class LoginDto {
  @IsEmail() email: string;
  @IsNotEmpty() password: string;
}

export class VerifyOtpDto {
  @IsEmail() email: string;
  @IsString() otp: string;
}

export class ForgotPasswordDto {
  @IsEmail() email: string;
}

export class ResetPasswordDto {
  @IsEmail() email: string;
  @IsString() otp: string;
  @IsNotEmpty() @MinLength(6) newPassword: string;
}
