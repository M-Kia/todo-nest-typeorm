import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from '../user.entity';
import { NotFoundException } from '@nestjs/common';

const testUser = new User({ id: 1, email: 'test@test.com', password: '12345' });
const testUser2 = new User({
  id: 2,
  email: 'testUser@email.com',
  password: 'test-user-password',
});

describe('AuthService', () => {
  let service: UserService;

  beforeEach(async () => {
    let users: User[] = [];
    const fakeUserRepository = {
      create: ({ email, password }: Partial<User>) =>
        ({ id: users.length + 1, email, password }) as User,
      save: (user: User) => {
        if (users.find((item) => item.id === user.id)) {
          users = users.map((item) => (item.id === user.id ? user : item));
        } else {
          users.push(user);
        }
        return Promise.resolve(user);
      },
      find: ({ where: { email } }: { where: { email: string } }) => {
        if (!email) {
          return Promise.resolve(users);
        }
        return Promise.resolve(users.filter((user) => user.email === email));
      },
      findOne: ({ where: { id } }: { where: { id: number } }) => {
        const user = users.find((user) => user.id === id) ?? null;

        return Promise.resolve(user ? user : null);
      },
      remove: (user: User) => {
        users = users.filter((item) => item.id !== user.id);
        return Promise.resolve(user);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'UserRepository',
          useValue: fakeUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('can create user', async () => {
    const user = await service.create(testUser.email, testUser.password);
    expect(user).toBeDefined();
  });

  it('get user list', async () => {
    await service.create(testUser.email, testUser.password);
    await service.create(testUser2.email, testUser2.password);

    const users = await service.find();

    expect(users.length).toEqual(2);
  });

  it('get user with specified email', async () => {
    await service.create(testUser.email, testUser.password);
    await service.create(testUser2.email, testUser2.password);

    const users = await service.find(testUser.email);

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual(testUser.email);
  });

  it('get user with specified id', async () => {
    await service.create(testUser.email, testUser.password);
    await service.create(testUser2.email, testUser2.password);

    const user = await service.findOne(testUser.id);

    expect(user).toBeDefined();
    expect(user.id).toEqual(testUser.id);
  });

  it('get null when the id does not exist', async () => {
    const user = await service.findOne(testUser.id);
    expect(user).toBeNull();
  });

  it('update user data', async () => {
    await service.create(testUser.email, testUser.password);

    const user = await service.update(1, {
      email: testUser2.email,
      password: testUser2.password,
    });

    expect(user).toBeDefined();
    expect(user.email).toEqual(testUser2.email);
    expect(user.password).toEqual(testUser2.password);
  });

  it('throws an error when updating unused id', async () => {
    await expect(
      service.update(1, {
        email: testUser2.email,
        password: testUser2.password,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove user', async () => {
    await service.create(testUser.email, testUser.password);

    let users = await service.find();

    expect(users.length).toEqual(1);

    const user = await service.remove(testUser.id);

    expect(user).toBeDefined();
    expect(user.id).toEqual(testUser.id);

    users = await service.find();

    expect(users.length).toEqual(0);
  });

  it('throw an error when removing unused id', async () => {
    await expect(service.remove(testUser.id)).rejects.toThrow(
      NotFoundException,
    );
  });
});
