import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  // CreateDateColumn,
  // DeleteDateColumn,
  // UpdateDateColumn,
} from 'typeorm';

import { Todo } from 'src/todo/todo.entity';
import { Column as ColumnEntity } from 'src/column/column.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => ColumnEntity, (column) => column.owner)
  columnList: ColumnEntity[];

  @OneToMany(() => Todo, (todo) => todo.owner)
  todoList: Todo[];

  // @CreateDateColumn({
  //   name: 'created_at',
  //   type: 'timestamp with time zone',
  //   comment: 'user created date',
  // })
  // created_at: Date;

  // @UpdateDateColumn({
  //   name: 'updated_at',
  //   type: 'timestamp with time zone',
  //   comment: 'user updated date',
  // })
  // updated_at: Date;

  // @DeleteDateColumn({
  //   name: 'deleted_at',
  //   type: 'timestamp with time zone',
  //   comment: 'user deleted date',
  // })
  // deleted_at: Date;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
