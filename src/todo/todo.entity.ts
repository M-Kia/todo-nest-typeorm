import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Column as ColumnEntity } from '../column/column.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  order: number;

  @ManyToOne(() => ColumnEntity, (column) => column.todoList)
  column: ColumnEntity;

  @ManyToOne(() => User, (user) => user.todoList)
  owner: User;

  constructor(todo: Partial<Todo>) {
    Object.assign(this, todo);
  }
}
