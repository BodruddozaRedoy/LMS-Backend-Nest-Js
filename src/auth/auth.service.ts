import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from '../user/dto/createUser.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  async registerUser(registerUserDto: CreateUserDto) {
    // console.log(registerUserDto);
    const hash = await bcrypt.hash(registerUserDto.password, 10);
    const user = await this.userService.createUser({
      ...registerUserDto,
      password: hash,
    });

    if (!user?.email) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user._id };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }
  async loginUser(loginDto: LoginDto) {
    // console.log(loginDto);
    const user = await this.userService.findByEmailWithPass(loginDto.email);
    if (!user?.email) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id };

    const { password: _password, ...safeUser } = user.toObject();
    const token = await this.jwtService.signAsync(payload);
    // console.log(t)
    // console.log(user);
    return {
      user: safeUser,
      token: { access: token },
    };
  }
}
