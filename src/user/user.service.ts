import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { UserSignupDto } from './dto/user-signup.dto';
import { stringToHash } from 'src/helpers/string.helpers';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  create(dto: UserSignupDto) {
    const user = this.repository.create({
      email: dto.email,
      password: stringToHash(dto.password),
    });

    return this.repository.save(user);
  }

  find(email?: string) {
    return this.repository.find({
      where: { email },
    });
  }

  async findOne(id: number) {
    const user = await this.repository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }

  async update(id: number, attributes: Partial<User>) {
    const user = await this.findOne(id);

    Object.assign(user, attributes);

    return this.repository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    return this.repository.remove(user);
  }
}
