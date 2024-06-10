import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { User } from '../user.entity';

const testUser = new User({ id: 1, email: 'test@test.com', password: '12345' });
const testUser2 = new User({
  id: 2,
  email: 'testUser@email.com',
  password: 'test-user-password',
});

describe('UserController', () => {
  let controller: UserController;
  let fakeUserService: Partial<UserService>;

  beforeEach(async () => {
    let users: User[] = [];

    fakeUserService = {
      create: async (email: string, password: string): Promise<User> => {
        const user = new User({
          id: users.length + 1,
          email,
          password,
        });
        users.push(user);

        return user;
      },
      find: async (email?: string): Promise<User[]> =>
        Promise.resolve(
          email ? users.filter((user) => user.email === email) : users,
        ),
      findOne: async (id: number): Promise<User> => {
        let user = users.find((item) => item.id === id);
        if (!user) {
          user = null;
        }

        return Promise.resolve(user);
      },
      update: async (id: number, attrs: Partial<User>): Promise<User> => {
        let user = users.find((item) => item.id === id);
        if (!user) {
          throw new NotFoundException('User not found');
        }

        users = users.map((item) => {
          if (item.id === id) {
            Object.assign(item, attrs);
            user = item;
          }
          return item;
        });

        return Promise.resolve(user);
      },
      remove: async (id: number): Promise<User> => {
        const user = users.find((item) => item.id === id);
        if (!user) {
          throw new NotFoundException('User not found');
        }

        users = users.filter((item) => item.id !== id);

        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUser', async () => {
    await controller.createUser({
      email: testUser.email,
      password: testUser.password,
    });
    await controller.createUser({
      email: testUser2.email,
      password: testUser2.password,
    });

    const users = await controller.findUserList(undefined);

    expect(users.length).toEqual(2);
  });

  it('findAllUser with email', async () => {
    await controller.createUser({
      email: testUser.email,
      password: testUser.password,
    });
    await controller.createUser({
      email: testUser2.email,
      password: testUser2.password,
    });

    const users = await controller.findUserList(testUser2.email);

    expect(users.length).toEqual(1);
  });

  it('findAllUser with unused email', async () => {
    await controller.createUser({
      email: testUser.email,
      password: testUser.password,
    });

    const users = await controller.findUserList(testUser2.email);

    expect(users.length).toEqual(0);
  });

  it('updateUser', async () => {
    await controller.createUser({
      email: testUser.email,
      password: testUser.password,
    });

    const user = await controller.updateUser('' + testUser.id, {
      password: testUser2.password,
    });

    expect(user).toBeDefined();
    expect(user.password).toEqual(testUser2.password);
  });

  it('updateUser with wrong id', async () => {
    await controller.createUser({
      email: testUser.email,
      password: testUser.password,
    });

    await expect(
      controller.updateUser('' + testUser2.id, {
        password: testUser2.password,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('updateUser with empty body', async () => {
    await controller.createUser({
      email: testUser.email,
      password: testUser.password,
    });

    await expect(controller.updateUser('' + testUser.id, {})).rejects.toThrow(
      BadRequestException,
    );
  });

  it('removeUser', async () => {
    await controller.createUser({
      email: testUser.email,
      password: testUser.password,
    });

    const user = await controller.removeUser('' + testUser.id);

    expect(user).toBeDefined();
  });

  it('removeUser with wrong id', async () => {
    await expect(controller.removeUser('' + testUser.id)).rejects.toThrow(
      NotFoundException,
    );
  });
});
