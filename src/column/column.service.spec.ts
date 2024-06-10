import { Test, TestingModule } from '@nestjs/testing';

import { ColumnService } from './column.service';
import { ColumnCreateDto } from './dto/column-create.dto';
import { User } from 'src/user/user.entity';
import { Column } from './column.entity';
import { NotFoundException } from '@nestjs/common';

const testUser1 = new User({
    id: 1,
    email: 'test@test.com',
    password: '12345',
  }),
  testUser2 = new User({
    id: 1,
    email: 'test2@test.com',
    password: '1234',
  });

const title = 'Lorem ipsum',
  title2 = 'Lorem ipsum 2',
  title3 = 'Lorem ipsum 3';

describe('ColumnService', () => {
  let service: ColumnService;

  beforeEach(async () => {
    let columns: Column[] = [];

    const fakeColumnRepository = {
      create: (dto: ColumnCreateDto) => {
        const column = new Column({
          id: columns.length + 1,
          title: dto.title,
          hasSendMail: dto.hasSendMail ?? false,
        });

        return Promise.resolve(column);
      },
      save: (column: Column) => {
        let theColumn = columns.find((item) => item.id === column.id);
        if (theColumn) {
          Object.assign(theColumn, column);
        } else {
          theColumn = column;
          columns.push(column);
        }

        return Promise.resolve(column);
      },
      find: ({
        where: {
          title,
          owner: { id },
        },
      }: {
        where: { title: string; owner: { id: number } };
      }) => {
        if (!title) {
          return Promise.resolve(columns);
        }
        return Promise.resolve(
          columns.filter(
            (column) => column.title.includes(title) && column.owner.id === id,
          ),
        );
      },
      findOne: ({
        where: { id, owner },
      }: {
        where: { id: number; owner: { id: number } };
      }) => {
        const column = columns.find(
          (column) => column.id === id && column.owner.id === owner.id,
        );

        return Promise.resolve(column);
      },
      remove: (column: Column) => {
        columns = columns.filter((item) => item.id !== column.id);
        return Promise.resolve(column);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColumnService,
        {
          provide: 'ColumnRepository',
          useValue: fakeColumnRepository,
        },
      ],
    }).compile();

    service = module.get<ColumnService>(ColumnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('can create column', async () => {
    let column = await service.create({ title }, testUser1);
    expect(column).toBeDefined();
    expect(column.title).toEqual(title);
    expect(column.hasSendMail).toEqual(false);
    expect(column.owner.id).toEqual(testUser1.id);

    column = await service.create(
      { title: title2, hasSendMail: true },
      testUser1,
    );
    expect(column).toBeDefined();
    expect(column.title).toEqual(title2);
    expect(column.hasSendMail).toEqual(true);
    expect(column.owner.id).toEqual(testUser1.id);

    column = await service.create(
      { title: title3, hasSendMail: false },
      testUser2,
    );
    expect(column).toBeDefined();
    expect(column.title).toEqual(title3);
    expect(column.hasSendMail).toEqual(false);
    expect(column.owner.id).toEqual(testUser2.id);
  });

  it('get column list', async () => {
    await service.create({ title }, testUser1);
    await service.create({ title: title2, hasSendMail: true }, testUser1);
    await service.create({ title: title3, hasSendMail: false }, testUser2);

    let columns = await service.find(testUser1);
    expect(columns.length).toEqual(2);

    columns = await service.find(testUser2);
    expect(columns.length).toEqual(1);
  });

  it('get column with description', async () => {
    await service.create({ title }, testUser1);
    await service.create({ title: title2, hasSendMail: true }, testUser1);
    await service.create({ title: title3, hasSendMail: false }, testUser2);

    let columns = await service.find(testUser1, 'Lorem ipsum');
    expect(columns.length).toEqual(2);
    expect(columns[0].title).toEqual(title);
    expect(columns[0].owner.id).toEqual(testUser1.id);
    expect(columns[1].title).toEqual(title2);
    expect(columns[1].owner.id).toEqual(testUser1.id);

    columns = await service.find(testUser2, 'Lorem ipsum 3');
    expect(columns).toEqual(1);
    expect(columns[0].title).toEqual(title3);
    expect(columns[0].owner.id).toEqual(testUser2.id);
  });

  it('get column with specified id', async () => {
    const createdColumn = await service.create({ title }, testUser1);
    const createdColumn2 = await service.create(
      { title: title3, hasSendMail: false },
      testUser2,
    );

    let column = await service.findOne(createdColumn.id, testUser1);
    expect(column).toBeDefined();
    expect(column.id).toEqual(createdColumn.id);
    expect(column.title).toEqual(title);
    expect(column.owner.id).toEqual(testUser2.id);

    column = await service.findOne(createdColumn2.id, testUser2);
    expect(column).toBeDefined();
    expect(column.id).toEqual(createdColumn2.id);
    expect(column.title).toEqual(title3);
    expect(column.owner.id).toEqual(testUser2.id);
  });

  it('get null when the id does not exist', async () => {
    const column = await service.findOne(1, testUser1);
    expect(column).toBeNull();
  });

  it('update user data', async () => {
    const createdColumn = await service.create({ title }, testUser1);

    let column = await service.update(
      createdColumn.id,
      {
        title: title2,
        hasSendMail: true,
      },
      testUser1,
    );
    expect(column).toBeDefined();
    expect(column.title).toEqual(title2);
    expect(column.hasSendMail).toEqual(true);

    column = await service.update(
      createdColumn.id,
      {
        title: title3,
      },
      testUser1,
    );
    expect(column).toBeDefined();
    expect(column.title).toEqual(title3);
    expect(column.hasSendMail).toEqual(true);

    column = await service.update(
      createdColumn.id,
      {
        hasSendMail: false,
      },
      testUser1,
    );
    expect(column).toBeDefined();
    expect(column.title).toEqual(title3);
    expect(column.hasSendMail).toEqual(false);
  });

  it('throws an error when updating unused id', async () => {
    await expect(
      service.update(
        1,
        {
          title,
        },
        testUser1,
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove user', async () => {
    const createdColumn = await service.create({ title }, testUser1);

    let users = await service.find(testUser1);

    expect(users.length).toEqual(1);

    const column = await service.remove(createdColumn.id, testUser1);
    expect(column).toBeDefined();
    expect(column.id).toEqual(createdColumn.id);

    users = await service.find(testUser1);

    expect(users.length).toEqual(0);
  });

  it('throw an error when removing unused id', async () => {
    const createdColumn = await service.create({ title }, testUser1);

    await expect(service.remove(10, testUser1)).rejects.toThrow(
      NotFoundException,
    );

    await expect(service.remove(createdColumn.id, testUser2)).rejects.toThrow(
      NotFoundException,
    );
  });
});
