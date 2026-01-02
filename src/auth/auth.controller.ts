import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    this.authService = authService;
  }
  @Post('register')
  async register(@Body() registerUserDto: CreateUserDto) {
    //logic for user register
    const result = await this.authService.registerUser(registerUserDto);
    return {
      message: 'User created successfully!',
      data: { access: result },
    };
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    //logic for user register
    const result = await this.authService.loginUser(loginDto);
    return {
      message: 'User Logged in successfully!',
      data: result,
    };
  }
}
