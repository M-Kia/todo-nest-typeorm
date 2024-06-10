import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { User } from '../user.entity';

const testUser = new User({ id: 1, email: 'test@test.com', password: '12345' });
const testUser2 = new User({
  id: 2,
  email: 'testUser@email.com',
  password: 'test-user-password',
});

describe('UserController', () => {
  let controller: AuthController;
  const session: Record<string, any> = {};
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeAuthService = {
      signUp: async (email: string, password: string): Promise<User> => {
        if (users.find((user) => user.email === email)) {
          throw new BadRequestException('Email in use');
        }

        const user = new User({ id: users.length + 1, email, password });
        users.push(user);

        return Promise.resolve(user);
      },
      signIn: async (email: string, password: string): Promise<User> => {
        const user = users.find((item) => item.email === email);
        if (!user) {
          throw new NotFoundException('User not found');
        }

        if (user.password !== password) {
          throw new BadRequestException('Wrong password');
        }

        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('can signup a user', async () => {
    const user = await controller.signUp(
      {
        email: testUser.email,
        password: testUser.password,
      },
      session,
    );

    expect(user).toBeDefined();
  });

  it('throw error when the email is in use', async () => {
    await controller.signUp(
      {
        email: testUser.email,
        password: testUser.password,
      },
      session,
    );

    await expect(
      controller.signUp(
        {
          email: testUser.email,
          password: testUser2.password,
        },
        session,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('can signup a user', async () => {
    await controller.signUp(
      {
        email: testUser.email,
        password: testUser.password,
      },
      session,
    );

    const user = await controller.signIn(
      {
        email: testUser.email,
        password: testUser.password,
      },
      session,
    );
    expect(user).toBeDefined();
  });

  it('throw error when the email is unused', async () => {
    await expect(
      controller.signIn(
        {
          email: testUser.email,
          password: testUser.password,
        },
        session,
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('throw error when the password is wrong', async () => {
    await controller.signUp(
      {
        email: testUser.email,
        password: testUser.password,
      },
      session,
    );

    await expect(
      controller.signIn(
        {
          email: testUser.email,
          password: testUser2.password,
        },
        session,
      ),
    ).rejects.toThrow(BadRequestException);
  });
});
