import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registerUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    this.authService = authService;
  }
  @Post('register')
  async register(@Body() registerUserDto: RegisterDto) {
    //logic for user register
    const result = await this.authService.registerUser(registerUserDto);
    return {
      message: 'User created successfully!',
      data: result,
    };
  }
}
