import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('register')
  register() {
    //logic for user register
    return { message: 'User Registered Successfully!' };
  }
}
