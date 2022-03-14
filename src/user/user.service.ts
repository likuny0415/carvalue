import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(email, password) {
    const user = this.userRepo.create({ email, password });
    return this.userRepo.save(user);
  }

  async findOne(id: string) {
    return await this.userRepo.findOne(id);
  }

  async find(email: string) {
    return await this.userRepo.find({ email: email });
  }

  // partial confines the types as input
  async update(id: string, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('not found');
    }

    Object.assign(user, attrs);
    return this.userRepo.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('not found');
    }
    return this.userRepo.remove(user);
  }
}
