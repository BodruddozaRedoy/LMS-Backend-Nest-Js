import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from 'src/auth/dto/registerUser.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(registerUserDto: RegisterDto) {
    try {
      return await this.userModel.create(registerUserDto);
    } catch (error: unknown) {
      console.log(error);
      const e = error as { code: number };
      if (e.code === 11000) {
        throw new ConflictException('Email is already taken!');
      }
    }
  }
}
