import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema'; // Import the Class, not the Schema object
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // Create a new user (Usually called by Admin or internally)
  async createUser(createUserDto: any): Promise<User> {
    const { email, password } = createUserDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) throw new BadRequestException('Email already registered');

    // Hash password if it's a plain string
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return user.save();
  }

  // Find a user by email (For general use)
  // Returning Promise<User | null> is better so logic can handle nulls without crashing
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // Find a user by email with password (Internal use for Login)
  async findByEmailWithPass(email: string): Promise<User | null> {
    // .select('+password') is only needed if you set "select: false" in your schema
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  // Get all users
  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  // Get user by ID
  async getUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Update User Profile
  async updateProfile(id: string, updateData: any): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password');

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // Delete User
  async deleteUser(id: string): Promise<{ message: string }> {
    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('User not found');
    return { message: 'User deleted successfully' };
  }
}
