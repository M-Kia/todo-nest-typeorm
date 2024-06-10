import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, In } from 'typeorm';

import { Todo } from './todo.entity';
import { TodoCreateDto } from './dto/todo-create.dto';
import { User } from 'src/user/user.entity';
import { ColumnService } from 'src/column/column.service';
import { TodoChangeColumnDto } from './dto/todo-change-column.dto';

@Injectable()
export class TodoService {
  constructor(
    private readonly repository: Repository<Todo>,
    private readonly columnService: ColumnService,
  ) {}

  async create(dto: TodoCreateDto, user: User): Promise<Todo> {
    const column = await this.columnService.findOne(dto.column_id, user);

    if (!column) {
      throw new NotFoundException('Column not found!');
    }

    const order = dto.order ?? column.todoList.length + 1;

    const todo = this.repository.create({
      description: dto.description,
      order,
    });

    todo.owner = user;
    todo.column = column;

    return this.repository.save(todo);
  }

  find(user: User, description?: string): Promise<Todo[]> {
    return this.repository.find({
      where: {
        description,
        owner: {
          id: user.id,
        },
      },
    });
  }

  findOne(id: number, user: User): Promise<Todo> {
    if (!id) {
      return null;
    }

    return this.repository.findOne({
      where: {
        id,
        owner: { id: user.id },
      },
    });
  }

  async update(
    id: number,
    attributes: Partial<Todo>,
    user: User,
  ): Promise<Todo> {
    const todo = await this.findOne(id, user);

    if (!todo) {
      throw new NotFoundException('Todo not found!');
    }

    Object.assign(todo, attributes);

    return this.repository.save(todo);
  }

  async remove(id: number, user: User): Promise<Todo> {
    const todo = await this.findOne(id, user);

    if (!todo) {
      throw new NotFoundException('Todo not found!');
    }

    return this.repository.remove(todo);
  }

  async reorder(id: number, order: number, user: User): Promise<Todo> {
    const todo = await this.findOne(id, user);

    if (todo.order === order) {
      return todo;
    }

    if (todo.column.todoList.length <= order) {
      throw new BadRequestException(
        "The order is higher than the column's length",
      );
    }

    let orderCondition = 'order > :todoOrder And order <= :order',
      orderChange = { order: () => 'order - 1' };

    if (todo.order > order) {
      orderCondition = 'order >= :order AND order < :todoOrder';
      orderChange = { order: () => 'order + 1' };
    }

    await this.repository
      .createQueryBuilder()
      .update(Todo)
      .set(orderChange)
      .where(orderCondition, { order, todoOrder: todo.order })
      .andWhere('owner_id = :owner_id', { owner_id: user.id })
      .andWhere('column_id = :column_id', { column_id: todo.column.id })
      .execute();

    todo.order = order;

    return this.repository.save(todo);
  }

  async changeTodoColumn(dto: TodoChangeColumnDto, user: User): Promise<void> {
    const todoList = await this.repository.find({
      where: {
        id: In(dto.todo_ids),
        owner: {
          id: user.id,
        },
      },
    });

    if (todoList.length !== dto.todo_ids.length) {
      throw new NotFoundException('Can not find all todo items');
    }

    const column = await this.columnService.findOne(dto.column_id, user);

    if (!column) {
      throw new NotFoundException('Column not found');
    }

    await this.repository
      .createQueryBuilder()
      .update(Todo)
      .set({ column })
      .where('id IN :todo_ids', { todo_ids: dto.todo_ids })
      .execute();
  }
}
