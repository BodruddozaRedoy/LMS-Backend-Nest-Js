import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async createUser(registerUserDto: CreateUserDto) {
    try {
      return await this.userModel.create(registerUserDto);
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: number }).code === 11000
      ) {
        throw new ConflictException('Email is already taken!');
      }

      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findByEmailWithPass(email: string) {
    return this.userModel.findOne({ email }).select('+password');
  }
  async getUserById(id: string) {
    return this.userModel.findOne({ _id: id });
  }
}
