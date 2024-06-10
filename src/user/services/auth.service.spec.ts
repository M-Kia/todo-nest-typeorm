import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { User } from '../user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const testEmail = 'test@test.com';
const testPassword = '12345';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UserService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUserService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);

        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: 1,
          email,
          password,
        } as User;
        users.push(user);

        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create a new user with a salted and hashed password', async () => {
    const user = await service.signUp(testEmail, testPassword);

    const [salt, hashedPassword] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hashedPassword).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signUp(testEmail, testPassword);

    await expect(service.signUp(testEmail, '1234')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws an error if signin is called with an unused email', async () => {
    await expect(service.signIn(testEmail, testPassword)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws an error if an invalid password is provided', async () => {
    await service.signUp(testEmail, testPassword);

    await expect(service.signIn(testEmail, '1234')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    await service.signUp(testEmail, testPassword);

    const user = await service.signIn(testEmail, testPassword);
    expect(user).toBeDefined();
  });
});
