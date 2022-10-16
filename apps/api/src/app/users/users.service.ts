import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  private convertUser = (user: UserDocument): UserDto => ({
    id: user.id,
    username: user.username,
    passwordHash: user.passwordHash,
    name: user.name,
  });

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const createdUser = new this.userModel(createUserDto);
    const user = await createdUser.save();
    return this.convertUser(user);
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.userModel.find().exec();
    return users.map((user) => this.convertUser(user));
  }

  async findOne(id: string): Promise<UserDto> {
    const user = await this.userModel.findById(id).exec();
    return this.convertUser(user);
  }

  async findOneByUsername(username: string): Promise<UserDto> {
    const user = await this.userModel.findOne({ username }).exec();
    return this.convertUser(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto)
      .exec();
    return this.convertUser(user);
  }

  async remove(id: string): Promise<UserDto> {
    const user = await this.userModel.findByIdAndRemove(id).exec();
    return this.convertUser(user);
  }
}
