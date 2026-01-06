import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/schemas/user.schema';
import {
  RegisterDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/createUser.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName } = registerDto;

    const userExists = await this.userModel.findOne({ email });
    if (userExists) throw new BadRequestException('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await this.userModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      otp,
      otpExpires,
    });

    // TODO: Send OTP via Email here
    console.log(`OTP for ${email} is ${otp}`);

    return { message: 'OTP sent to email' };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;

    // Use 'as any' if TS still struggles with the Date comparison after schema fix
    const user = await this.userModel.findOne({
      email,
      otp,
      otpExpires: { $gt: new Date() } as any,
    });

    if (!user) throw new BadRequestException('Invalid or expired OTP');

    user.isVerified = true;

    // Fix: Type 'null' assignability
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    return { message: 'Account verified successfully' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified)
      throw new UnauthorizedException('Please verify your email');

    const payload = { sub: user._id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { id: user._id, email: user.email, firstName: user.firstName },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('User not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // TODO: Send OTP via Email
    return { message: 'Password reset OTP sent to email' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, otp, newPassword } = resetPasswordDto;

    const user = await this.userModel.findOne({
      email,
      otp,
      otpExpires: { $gt: new Date() } as any,
    });

    if (!user) throw new BadRequestException('Invalid or expired OTP');

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    return { message: 'Password reset successful' };
  }

  // Wrapper methods for controller compatibility
  async registerUser(createUserDto: CreateUserDto) {
    // Split full_name into firstName and lastName
    const nameParts = createUserDto.full_name.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const registerDto: RegisterDto = {
      email: createUserDto.email,
      password: createUserDto.password,
      firstName,
      lastName,
    };
    await this.register(registerDto);
    // Return token after registration (assuming user verifies immediately in dev)
    const user = await this.userModel.findOne({ email: registerDto.email });
    if (user) {
      const payload = { sub: user._id, email: user.email };
      return await this.jwtService.signAsync(payload);
    }
    return null;
  }

  async loginUser(loginDto: LoginDto) {
    return await this.login(loginDto);
  }
}
