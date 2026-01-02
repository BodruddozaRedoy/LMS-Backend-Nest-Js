import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    this.authService = authService;
  }
  @Post('register')
  register() {
    //logic for user register
    const result = this.authService.registerUser();
    return result;
  }
}
