import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly service: UserService) {}

  async signUp(email: string, password: string) {
    const users = await this.service.find(email);

    if (users.length !== 0) {
      throw new BadRequestException('Email in use');
    }

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const hashedPasswordWithSalt = salt + '.' + hash.toString('hex');

    const user = await this.service.create(email, hashedPasswordWithSalt);

    return user;
  }

  async signIn(email: string, password: string) {
    const [user] = await this.service.find(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, hashedPassword] = user.password.split('.');

    const entryHashedPassword = (
      (await scrypt(password, salt, 32)) as Buffer
    ).toString('hex');

    if (entryHashedPassword !== hashedPassword) {
      throw new BadRequestException('Wrong password');
    }

    return user;
  }
}
