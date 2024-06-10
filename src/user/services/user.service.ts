import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  create(email: string, password: string): Promise<User> {
    const user = this.repository.create({
      email,
      password,
    });

    return this.repository.save(user);
  }

  find(email?: string): Promise<User[]> {
    return this.repository.find({
      where: { email },
    });
  }

  findOne(id: number): Promise<User> {
    if (!id) {
      return null;
    }

    return this.repository.findOne({ where: { id } });
  }

  async update(id: number, attributes: Partial<User>): Promise<User> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    Object.assign(user, attributes);

    return this.repository.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return this.repository.remove(user);
  }
}
