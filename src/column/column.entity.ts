import {
  Entity,
  PrimaryGeneratedColumn,
  Column as TypeOrmColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { Todo } from 'src/todo/todo.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class Column {
  @PrimaryGeneratedColumn()
  id: number;

  @TypeOrmColumn()
  title: string;

  @TypeOrmColumn({ name: 'has_send_mail', default: false })
  hasSendMail: boolean;

  @ManyToOne(() => User, (user) => user.columnList)
  owner: User;

  @OneToMany(() => Todo, (todo) => todo.column)
  todoList: Todo[];

  constructor(column: Partial<Column>) {
    Object.assign(this, column);
  }
}
