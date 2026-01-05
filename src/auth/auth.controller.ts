import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    this.authService = authService;
  }
  // Register User
  @Post('register')
  async register(@Body() registerUserDto: CreateUserDto) {
    //logic for user register
    console.log(registerUserDto);
    const result = await this.authService.registerUser(registerUserDto);
    return {
      message: 'User created successfully!',
      data: { access: result },
    };
  }
  // Login user
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    //logic for user register
    const result = await this.authService.loginUser(loginDto);
    return {
      message: 'User Logged in successfully!',
      data: result,
    };
  }
  // Get Profile
  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.sub;
    const user = await this.userService.getUserById(userId);
    console.log(user);
    return {
      message: 'User fetched successfully!',
      data: user,
    };
  }
}
